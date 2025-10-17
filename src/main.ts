

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



// Получаем от сервера товары и записываем их в модель
larekApi
  .getProductList()
  .then((products) => {
    console.log("Получено товаров с сервера:", products.length);

    //         // Сохраняем в модель
    productsModel.setItems(products);
    console.log("Каталог сохранён в ProductsModel");

    //         // Проверяем содержимое модели
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

    card.id = product.id;
    card.title = product.title;
    card.price = product.price;
    card.image = CDN_URL + product.image;
    card.category = product.category;

    return card.render();
  });

  gallery.render({ items: cardElements });
});

// Открытие корзины обрабатывается внутри Header (эмитит 'basket:open')

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

  card.id = product.id;
  card.title = product.title;
  card.image = CDN_URL + product.image;
  card.category = product.category;
  card.description = product.description;
  card.price = product.price;
  card.inCart = cartModel.isInCart(product.id);

  modal.open(card.element);
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
  const items = cartModel.getCartItems();
  const totalPrice = cartModel.getTotalPrice();
  const quantity = cartModel.getItemsCount();
  const isEmpty = quantity === 0;

  const renderedCards = items.map((product, index) => {
    const cardEl = cloneTemplate<HTMLElement>(cardBasketTemplate);
    const card = new CardBasket(cardEl, events);
    card.id = product.id;
    card.title = product.title;
    card.price = product.price !== null ? product.price : 0;
    card.index = index + 1;
    return card.element;
  });

  header.counter = quantity;
  basketView.render({
    items: renderedCards,
    total: totalPrice,
    buttonDisabled: isEmpty || totalPrice === 0,
    isEmpty: isEmpty
  });
});

// При открытии корзины — показать текущее содержимое
events.on('basket:open', () => {
  modal.open(basketView.element);
});

// Удалить товар из корзины из списка корзины
events.on('basket:remove', (data: { id: string }) => {
  cartModel.removeFromCart(data.id);
});

// Нажатие «Оформить» — перейти к форме оплаты
events.on('basket:order', () => {
  modal.open(paymentForm.element);
});

// Выбор способа оплаты
events.on('payment:changed', (data: { payment: 'card' | 'cash' }) => {
  buyerModel.setBuyerData({ payment: data.payment });
});

// Ввод адреса доставки
events.on('address:changed', (data: { address: string }) => {
  buyerModel.setBuyerData({ address: data.address });
});

// Отправка формы оплаты — перейти к форме контактов
events.on('paymentForm:submit', () => {
  modal.open(contactsForm.element);
});

// Изменение полей формы контактов
events.on('contacts:change', (data: { field: string; value: string }) => {
  if (data.field === 'email') {
    buyerModel.setBuyerData({ email: data.value });
  } else if (data.field === 'phone') {
    buyerModel.setBuyerData({ phone: data.value });
  }
});

// При изменении данных покупателя — синхронизировать обе формы и валидацию
events.on('buyer:changed', () => {
  const validation = buyerModel.validate();
  const buyerData = buyerModel.getBuyerData();

  paymentForm.payment = buyerData.payment === '' ? null : buyerData.payment as 'card' | 'cash';
  paymentForm.address = buyerData.address;
  paymentForm.valid = validation.isValid;
  paymentForm.errors = [validation.errors.payment, validation.errors.address]
    .filter(Boolean).join(', ');

  contactsForm.email = buyerData.email;
  contactsForm.phone = buyerData.phone;
  contactsForm.valid = validation.isValid;
  contactsForm.errors = [validation.errors.email, validation.errors.phone]
    .filter(Boolean).join(', ');
});

// Отправка формы контактов — размещение заказа
events.on('ContactsForm:submit', async () => {
  const validation = buyerModel.validate();
  if (!validation.isValid) return;

  try {
    const orderData: IOrderRequest = {
      payment: buyerModel.getBuyerData().payment,
      email: buyerModel.getBuyerData().email,
      phone: buyerModel.getBuyerData().phone,
      address: buyerModel.getBuyerData().address,
      total: cartModel.getTotalPrice(),
      items: cartModel.getCartItems().map(product => product.id),
    };

    const response = await larekApi.sendOrder(orderData);

    cartModel.clearCart();
    buyerModel.clearData();
    header.counter = cartModel.getItemsCount();

    const successElement = cloneTemplate<HTMLElement>(successTemplate);
    const successView = new SuccessView(successElement, events);
    successView.render({ total: response.total });
    modal.open(successElement);
  } catch (error) {
    console.error('Не удалось разместить заказ: ', error);
  }
});

// Закрыть окно успешного заказа
events.on('success:close', () => {
  modal.close();
});
