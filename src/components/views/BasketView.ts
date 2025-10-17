import { Component } from '../base/Component'; 
import { IEvents } from '../base/Events'; 
 
interface IBasketView { 
    items: HTMLElement[]; 
    total: number; 
    buttonDisabled: boolean; 
    isEmpty: boolean; 
} 
 
export class BasketView extends Component<IBasketView> { 
    protected _list: HTMLElement; 
    protected _total: HTMLElement; 
    protected _button: HTMLButtonElement; 
    protected _empty: HTMLElement; 
 
    constructor(container: HTMLElement, protected events: IEvents) { 
        super(container); 
 
        this._list = container.querySelector('.basket__list') as HTMLElement; 
        this._total = container.querySelector('.basket__price') as HTMLElement; 
        this._button = container.querySelector('.basket__button') as HTMLButtonElement; 
        this._empty = container.querySelector('.basket__empty') as HTMLElement; 
 
        // Обработчик оформления заказа 
        this._button.addEventListener('click', () => { 
            this.events.emit('basket:order'); 
        }); 
    } 
 
    set items(items: HTMLElement[]) { 
  
        this._list.replaceChildren(...items); 
        const isEmpty = items.length === 0;
        this.isEmpty = isEmpty; 
        this.buttonDisabled = isEmpty;
    } 
 
    set total(value: number) { 
        if (this._total) { 
            this._total.textContent = `${value} синапсов`; 
        } 
    } 
 
    set buttonDisabled(value: boolean) { 
        if (this._button) { 
            this._button.disabled = value; 
        } 
    } 
 
    set isEmpty(value: boolean) { 
        if (this._empty) { 
            this._empty.classList.toggle('basket__empty_active', value); 
        } 
        if (this._list) { 
            this._list.classList.toggle('basket__list_hidden', value); 
        } 
        if (this._button) { 
            this._button.classList.toggle('basket__button_hidden', value); 
        } 
        if (this._total) { 
            this._total.classList.toggle('basket__price_hidden', value); 
        } 
    } 
     
} 