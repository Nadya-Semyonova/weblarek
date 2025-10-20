import { Card } from "./Card";
import { IEvents } from "../base/Events";
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';


export class CardPreview extends Card {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;
    private _id: string = ''; 
    private _productPrice: number | null = null;
    _inCart: boolean = false;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    


    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);
        this._image = this.container.querySelector('.card__image') as HTMLImageElement;
        this._category = this.container.querySelector('.card__category') as HTMLElement;
        this._button.addEventListener('click', (event) => {
            event.stopPropagation();

            if (this._productPrice === null) return;

            if (this._inCart) {
                this.events.emit('card:remove-from-cart', { id: this._id });
            } else {
                this.events.emit('card:add-to-cart', { id: this._id });
            }
            this.events.emit('card:close');
        });
    }
     set image(value: string) {
        this.setImage(this._image, value, this._title?.textContent || '');
    }
    
    set category(value: string) {
        this.setText(this._category, value);
        const cssClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this._category.className = `card__category ${cssClass}`;
    }
    set id(value: string) {
        this._id = value;
    }

    set inCart(value: boolean) {
        this._inCart = value;
        this.updateButton();
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set buttonCaption(value: string) {
        this.setText(this._button, value);
    }

    set price(value: number | null) {
        this._productPrice = value;
        this.updateButton();

        if (value === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
        
    }

    protected setDisabled(element: HTMLElement, state: boolean) { 
        if (element) { 
            if (state) { 
                element.setAttribute('disabled', 'disabled'); 
            } else { 
                element.removeAttribute('disabled'); 
            } 
        } 
    } 

    private updateButton() {
        if (this._productPrice === null) {
            this.setText(this._button, 'Недоступно');
            this.setDisabled(this._button, true);
        } else if (this._inCart) {
            this.setText(this._button, 'Удалить из корзины');
            this.setDisabled(this._button, false);
        } else {
            this.setText(this._button, 'Купить');
            this.setDisabled(this._button, false);
        }
    }
}