import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils'


export class CardBasket extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _index: HTMLElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);

        this._button.addEventListener('click', () => {
            this.events.emit('basket:remove', { id: container.dataset.id });
        });
    }

    
    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number) {
        if (value === 0) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    set index(value: number) {
        this.setText(this._index, String(value));
    }
    

    set id(value: string) {
        this.container.dataset.id = value;
    }
}
