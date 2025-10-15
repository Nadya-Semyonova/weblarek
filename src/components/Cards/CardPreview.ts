import { Card } from "./Card";
import { IEvents } from "../base/Events";
import { ensureElement } from '../../utils/utils';


export class CardPreview extends Card {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;
    private _id: string = ''; 
    private _productPrice: number | null = null;
    _inCart: boolean = false;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);
        
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