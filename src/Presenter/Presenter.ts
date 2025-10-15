import { IEvents } from '../components/base/Events';
import { Products } from '../components/Models/Products';
import { Cart } from '../components/Models/Cart';
import { Buyer } from '../components/Models/Buyer';
import { WebLarekAPI } from '../components/WebLarekAPI/WebLarekAPI';
import { CardCatalog } from '../components/Cards/CardCatalog';
import { CardPreview } from '../components/Cards/CardPreview';
import { CardBasket } from '../components/Cards/CardBasket';
import { Gallery } from '../components/views/Gallery';
import { BasketView } from '../components/views/BasketView';
import { ContactsForm } from '../components/forms/ContactsForm';
import { PaymentForm } from '../components/forms/PaymentForm';
import { ModalView } from '../components/views/ModalView';
import { Header } from '../components/views/Header';
import { CDN_URL } from '../utils/constants';
import { SuccessView } from '../components/views/SuccessView';

export class Presenter {
    private catalogCards: CardCatalog[] = [];
    private basketItems: CardBasket[] = [];
    private currentOrderForm: PaymentForm | null = null;
    private currentContactsForm: ContactsForm | null = null;
    private currentBasketView: BasketView | null = null;


    constructor(
        private events: IEvents,
        private catalog: Products,
        private cart: Cart,
        private buyer: Buyer,
        private api: WebLarekAPI,
        private gallery: Gallery,
        private header: Header,
        private modal: ModalView,
    ) {
        this.init();
    }
private init() {
    this.events.on('catalog:changed', this.handleCatalogChanged.bind(this));
    this.events.on('catalog:selected', this.handleProductSelected.bind(this));
    this.events.on('cart:changed', this.handleCartChanged.bind(this));
    this.events.on('buyer:changed', this.handleBuyerChanged.bind(this));

    this.events.on('card:close', this.handleCardClose.bind(this));
    this.events.on('card:select', this.handleCardSelect.bind(this));
    this.events.on('card:to-basket', this.handleAddToBasket.bind(this));
    this.events.on('basket:remove', this.handleRemoveFromBasket.bind(this));
    this.events.on('basket:open', this.handleOpenBasket.bind(this)); 
    this.events.on('basket:order', this.handleOrderStart.bind(this));
    this.events.on('PaymentForm:submit', this.handleOpenContactsForm.bind(this));
    this.events.on('ContactsForm:submit', this.handleContactsSubmit.bind(this));
    this.events.on('success:close', this.handleSuccessClose.bind(this));
    this.events.on('card:add-to-cart', this.handleAddToCart.bind(this));
    this.events.on('card:remove-from-cart', this.handleRemoveFromCart.bind(this));
    this.events.on('modal:close', this.handleModalClose.bind(this));
}

private handleCatalogChanged() {
    const products = this.catalog.getItems();
    this.catalogCards = products.map(product => {
        const cardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
        const cardElement = cardTemplate.content.querySelector('.card')!.cloneNode(true) as HTMLElement;
        const card = new CardCatalog(cardElement, this.events);
  
        card.render({
            id: product.id,
            title: product.title,
            image: CDN_URL + product.image,
            category: product.category,
            price: product.price
        });
        return card;
    });
    this.gallery.render({ items: this.catalogCards.map(card => card.element) });
}

private handleProductSelected() {
    const product = this.catalog.getCard();
    if (product) {
        const cardTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
        const cardElement = cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const card = new CardPreview(cardElement, this.events);
        const inCart = this.cart.isInCart(product.id);
        card.render({
            id: product.id,
            title: product.title,
            image: CDN_URL + product.image,
            category: product.category,
            price: product.price,
            description: product.description
        });
        card.inCart = inCart;
        this.modal.open(card.element);
    }
}

private handleCartChanged() {
    const items = this.cart.getCartItems();
    const total = this.cart.getTotalPrice();
    const hasValidItems = total > 0;
    const isEmpty = items.length === 0;

    this.header.counter = this.cart.getItemsCount();

    this.catalogCards.forEach(card => {
        const product = this.catalog.getItemById(card.element.dataset.id!);
        if (product) {
            card.inCart = this.cart.isInCart(product.id);
        }
    });

    if (this.currentBasketView) {
        this.basketItems = items.map((item, index) => {
            const cardTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
            const cardElement = cardTemplate.content.querySelector('.basket__item')!.cloneNode(true) as HTMLElement;
            const card = new CardBasket(cardElement, this.events);
            card.render({
                id: item.id,
                title: item.title,
                price: item.price !== null ? item.price : 0,
            });
            card.index = index + 1;
            return card;
        });

        this.currentBasketView.render({
            items: this.basketItems.map(item => item.element),
            total,
            buttonDisabled: items.length === 0 || !hasValidItems,
            isEmpty
        });
    }
}

private handleBuyerChanged() {
    
    const paymentValidation = this.buyer.validate();

    if (this.currentOrderForm) {
        const errors: string[] = [];
        if (paymentValidation.errors.payment) {
            errors.push(paymentValidation.errors.payment);
        }
        if (paymentValidation.errors.address) {
            errors.push(paymentValidation.errors.address);
        }
        
        this.currentOrderForm.errors = errors.join(', ');
        this.currentOrderForm.valid = paymentValidation.isValid;
        
        this.updateOrderFormButton(paymentValidation.isValid);
    }

    
    if (this.currentContactsForm) {
        const contactValidation = this.buyer.validate();
        const errors: string[] = [];
        
        if (contactValidation.errors.email) {
            errors.push(contactValidation.errors.email);
        }
        if (contactValidation.errors.phone) {
            errors.push(contactValidation.errors.phone);
        }

        this.currentContactsForm.errors = errors.join(', ');
        this.currentContactsForm.valid = contactValidation.isValid;
    }
}

private updateOrderFormButton(isValid: boolean) {
    if (this.currentOrderForm) {
        const button = this.currentOrderForm.element.querySelector('.button') as HTMLButtonElement;
        if (button) {
            button.disabled = !isValid;
        }
    }
}

private handleCardSelect(data: { id: string }) {
    const product = this.catalog.getItemById(data.id);
    if (product) {
        this.catalog.setCard(product);
        this.events.emit('catalog:selected');
    }
}

private handleAddToBasket() {
    const product = this.catalog.getCard();
    if (product) {
        this.cart.addToCart(product);
        this.events.emit('cart:changed');
        this.modal.close();
    }
}

private handleRemoveFromBasket(data: { id: string }) {
    this.cart.removeFromCart(data.id);
    this.events.emit('cart:changed');
}

private handleOpenBasket() {
    const items = this.cart.getCartItems();
    const total = this.cart.getTotalPrice();
    const hasValidItems = total > 0;
    const isEmpty = items.length === 0;

    this.basketItems = items.map((item, index) => {
        const cardTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
        const cardElement = cardTemplate.content.querySelector('.basket__item')!.cloneNode(true) as HTMLElement;
        const card = new CardBasket(cardElement, this.events);
        card.render({
            id: item.id,
            title: item.title,
            price: item.price !== null ? item.price : 0,
        });
        card.index = index + 1;
        return card;
    });

    const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
    const basketElement = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const basketView = new BasketView(basketElement, this.events);

    basketView.render({
        items: this.basketItems.map(item => item.element),
        total,
        buttonDisabled: items.length === 0 || !hasValidItems,
        isEmpty
    });

    this.currentBasketView = basketView;
    this.modal.open(basketView.element);
}

private handleCardClose() {
    this.modal.close();
}

private handleOrderStart() {
    const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
    const orderElement = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const orderForm = new PaymentForm(orderElement as HTMLFormElement, this.events);

    this.currentOrderForm = orderForm;
    this.currentContactsForm = null;

    this.modal.open(orderElement);

    setTimeout(() => {
        orderForm.initForm();
    }, 0);
    
}

private handleOpenContactsForm() {
    const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
    const contactsElement = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const contactsForm = new ContactsForm(contactsElement as HTMLFormElement, this.events);

    this.currentContactsForm = contactsForm;

    

    // Открываем модальное окно
    this.modal.open(contactsElement);

    // Инициализируем форму после вставки в DOM
    setTimeout(() => {
        contactsForm.initForm();
        
        
    }, 0);
}

private handleContactsSubmit() {
    // Проверяем валидность формы перед отправкой
    if (this.currentContactsForm && this.currentContactsForm.valid) {
        console.log('Обработка отправки формы контактов');
        // Закрываем форму контактов и открываем успешное оформление
        this.modal.close();
        this.showSuccessView();
        
        // Очищаем корзину после успешного заказа
        this.cart.clearCart();
        this.events.emit('cart:changed');
    } else {
        console.log('Форма контактов не валидна, отправка отменена');
    }
}

private showSuccessView() {
    const successTemplate = document.getElementById('success') as HTMLTemplateElement;
    const successElement = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    
    // Создаем SuccessView компонент
    const successView = new SuccessView(successElement, this.events);
    
    // Устанавливаем сумму заказа
    const total = this.cart.getTotalPrice();
    successView.total = total;

    this.modal.open(successElement);
    
    console.log('Открыто окно успешного заказа, сумма:', total);
}

private handleSuccessClose() {
    this.currentOrderForm = null;
    this.currentContactsForm = null;
    this.currentBasketView = null;
    this.modal.close();
}

private handleAddToCart(data: { id: string }) {
    const product = this.catalog.getItemById(data.id);
    if (product && product.price !== null) {
        this.cart.addToCart(product);
        this.events.emit('cart:changed');
    }
}

private handleRemoveFromCart(data: { id: string }) {
    this.cart.removeFromCart(data.id);
    this.events.emit('cart:changed');
}

private handleModalClose() {
    this.currentOrderForm = null;
    this.currentContactsForm = null;
    this.currentBasketView = null;
}

async Products(): Promise<void> {
    try {
        console.log('Загрузка товаров с сервера...');
        const products = await this.api.getProductList();
        this.catalog.setItems(products);
        this.events.emit('catalog:changed');
        console.log(`Товары загружены: ${products.length} шт.`);
    } catch (error) {
        console.error('Ошибка загрузки с сервера:', error);

    }
}
}