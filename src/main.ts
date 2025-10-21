
import "./scss/styles.scss";
import { EventEmitter } from './components/base/Events';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { WebLarekAPI } from './components/WebLarekAPI/WebLarekAPI';
import { Api } from "./components/base/Api";
import { CardCatalog } from './components/Cards/CardCatalog';
import { CardPreview } from './components/Cards/CardPreview';
import { CardBasket } from './components/Cards/CardBasket';
import { Gallery } from './components/views/Gallery';
import { BasketView } from './components/views/BasketView';
import { ContactsForm } from './components/forms/ContactsForm';
import { PaymentForm } from './components/forms/PaymentForm';
import { ModalView } from './components/views/ModalView';
import { SuccessView } from './components/views/SuccessView';
import { Header } from './components/views/Header';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrderRequest } from './types';
import { apiProducts } from './utils/data';




const events = new EventEmitter();
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);
const productsModel = new Products(events);
const api = new Api(API_URL);
const larekApi = new WebLarekAPI(api);

// Инициализация галереи и Header
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(events, ensureElement<HTMLElement>('.header__basket'));
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

// Инициализация Modal и шаблонов форм/корзины/превью/успеха
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new ModalView(modalContainer, events);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const paymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Инициализация представлений корзины и форм
const basketElement = cloneTemplate<HTMLElement>(basketTemplate);
const basketView = new BasketView(basketElement, events);
const paymentFormElement = cloneTemplate<HTMLFormElement>(paymentTemplate);
const paymentForm = new PaymentForm(paymentFormElement, events);
const contactsFormElement = cloneTemplate<HTMLFormElement>(contactsTemplate);
const contactsForm = new ContactsForm(contactsFormElement, events);
const successElement = cloneTemplate<HTMLElement>(successTemplate);
const successView = new SuccessView(successElement, events);



// загрузка товаров

larekApi.getProductList()
  .then((products) => {
    console.log("Получено товаров с сервера:", products.length);
    productsModel.setItems(products);
    console.log("Каталог сохранён в ProductsModel");
    const storedProducts = productsModel.getItems();
    console.log("Товары в каталоге после загрузки:", storedProducts);
  })
  .catch((err) => {
    console.error("Ошибка при загрузке товаров:", err);
      try {
        productsModel.setItems(apiProducts.items);
        console.warn('Каталог загружен из локальных данных');
      } catch (fallbackErr) {
        console.error('Ошибка отображения локального каталога:', fallbackErr);
      }
    });

// Обработчик события изменения каталога: рендерим карточки товаров
events.on('catalog:changed', () => {
  const products = productsModel.getItems();
  const cardElements = products.map((product) => {
    const cardElement = cloneTemplate<HTMLElement>(cardCatalogTemplate);
    const card = new CardCatalog(cardElement, events);

    const productWithImage = {
      ...product,
      image: CDN_URL + product.image
    }

    return card.render(productWithImage);
  });

  gallery.render({ items: cardElements });
}); 



// Клик на карточку каталога: выбрать товар для превью
events.on('card:select', (data: { id: string }) => {
  const product = productsModel.getItemById(data.id);
  if (product) {
    productsModel.setCard(product);
  }
});

// Когда выбранная карточка изменилась — открыть превью
events.on('products:cardChanged', () => {
  const product = productsModel.getCard();
  if (!product) return;

  const cardElement = cloneTemplate<HTMLElement>(cardPreviewTemplate);
  const card = new CardPreview(cardElement, events);

  const productData = {
    ...product,
    image: CDN_URL + product.image,
    inCart: cartModel.isInCart(product.id)
  };

  modal.open(card.render(productData));
});

// Добавить/удалить товар из корзины из превью карточки
events.on('card:add-to-cart', (data: { id: string }) => {
  const product = productsModel.getItemById(data.id);
  if (product) {
    cartModel.addToCart(product);
  }
});

events.on('card:remove-from-cart', (data: { id: string }) => {
  cartModel.removeFromCart(data.id);
});

// Закрыть превью карточки
events.on('card:close', () => {
  modal.close();
});

// Товары в корзине изменились — обновить счетчик и содержимое корзины
events.on('cart:changed', () => {
  const totalPrice = cartModel.getTotalPrice();
  
  const renderedCards = cartModel.getCartItems().map((product, index) => {
    const cardEl = cloneTemplate<HTMLElement>(cardBasketTemplate);
    const card = new CardBasket(cardEl, events);
    const productWithIndex = {
      ...product,
      index: index + 1
    };
    return card.render(productWithIndex);
  });

  header.render({ counter: cartModel.getItemsCount() });
  basketView.render({ items: renderedCards, total: totalPrice });
});



// При открытии корзины — просто показываем текущее содержимое
events.on('basket:open', () => {
  modal.open(basketView.render());
});


// Удалить товар из корзины из списка корзины
events.on('basket:remove', (data: { id: string }) => {
  cartModel.removeFromCart(data.id);
});

// Нажатие «Оформить» — перейти к форме оплаты
events.on('basket:order', () => {
  modal.open(paymentForm.render());
});

// Обработчики изменений данных формы оплаты
events.on('payment:changed', (data: { payment: 'card' | 'cash' }) => {
  buyerModel.setBuyerData({ payment: data.payment });
});

events.on('address:changed', (data: { address: string }) => {
  buyerModel.setBuyerData({ address: data.address });
});


// Нажатие «Оформить» в корзине — перейти к форме оплаты
events.on('basket:order', () => {
  
// Инициализируем форму данными из модели перед открытием
  const buyerData = buyerModel.getBuyerData();
  paymentForm.payment = buyerData.payment;
  paymentForm.address = buyerData.address
  
  // Принудительно обновляем валидацию;
  const validation = buyerModel.validate();
  const paymentValid = !validation.errors.payment && !validation.errors.address;
  paymentForm.valid = paymentValid;
  paymentForm.errors = [validation.errors.payment, validation.errors.address]
      .filter(Boolean)
      .join(', ');
  
  modal.open(paymentForm.render());
});

// Отправка формы оплаты - перейти к форме контактов
events.on('paymentForm:submit', () => {
  const validation = buyerModel.validate();
  if (!validation.errors.payment && !validation.errors.address) {
      modal.open(contactsForm.render());
  }
});

events.on('contacts:change', (data: { field: string; value: string }) => {
  if (data.field === 'email') {
    buyerModel.setBuyerData({ email: data.value });
  } else if (data.field === 'phone') {
    buyerModel.setBuyerData({ phone: data.value });
  }
});

// Обновление валидации формы оплаты при изменении данных покупателя
events.on('buyer:changed', (data: { field: string }) => {
  const validation = buyerModel.validate();
  if (data.field === 'payment' || data.field === 'address') {
    // Обновляем форму оплаты (проверяем только payment и address)
    paymentForm.payment = buyerModel.getBuyerData().payment;
    paymentForm.address = buyerModel.getBuyerData().address;
    const paymentValid =
      !validation.errors.payment && !validation.errors.address;
    paymentForm.valid = paymentValid;
    paymentForm.errors = [validation.errors.payment, validation.errors.address]
      .filter(Boolean)
      .join(', ');
  }
  if (data.field === 'phone' || data.field === 'email') {
    // Обновляем форму контактов (проверяем только email и phone)
    contactsForm.email = buyerModel.getBuyerData().email;
    contactsForm.phone = buyerModel.getBuyerData().phone;
    const contactsValid = !validation.errors.email && !validation.errors.phone;
    contactsForm.valid = contactsValid;
    contactsForm.errors = [validation.errors.email, validation.errors.phone]
      .filter(Boolean)
      .join(', ');
  }
});

// Отправка формы контактов - завершить заказ
events.on('ContactsForm:submit', () => {
  const validation = buyerModel.validate();
  if (validation.isValid) {
    const orderData: IOrderRequest = {
      payment: buyerModel.getBuyerData().payment,
      email: buyerModel.getBuyerData().email,
      phone: buyerModel.getBuyerData().phone,
      address: buyerModel.getBuyerData().address,
      total: cartModel.getTotalPrice(),
      items: cartModel.getCartItems().map(item => item.id)
    };

    larekApi.sendOrder(orderData)
      .then((result) => {
       
           // Показываем окно успешного заказа с общей суммой
           successView.total = result.total;
           modal.open(successView.render());
           
           // Очищаем корзину и данные покупателя
           cartModel.clearCart();
           buyerModel.clearData();
         })
         .catch((err) => {
           console.error('Ошибка при создании заказа:', err);
           contactsForm.errors = 'Ошибка при оформлении заказа. Попробуйте еще раз.';
         });
     }
   });
   
   // Закрытие успешного заказа
   events.on('success:close', () => {
     modal.close();
   });
