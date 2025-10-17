import { Card } from './Card';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class CardBasket extends Card {
    protected _button: HTMLButtonElement;
    protected _index: HTMLElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        
        this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);

        this._button.addEventListener('click', () => {
            this.events.emit('basket:remove', { id: this.container.dataset.id });
        });
    }

    set index(value: number) {
        this.setText(this._index, String(value));
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }
}