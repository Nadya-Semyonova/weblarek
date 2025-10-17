import { Component } from '../base/Component';


interface ICardData {
    title: string;
    price: number | null;
}

export abstract class Card extends Component<ICardData> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(protected container: HTMLElement) {
        super(container);
        this._title = this.container.querySelector('.card__title') as HTMLElement;
        this._price = this.container.querySelector('.card__price') as HTMLElement;
    }
    
    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }
}