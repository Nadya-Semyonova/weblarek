import { Component } from '../base/Component';

export class Page extends Component<{}> {
    protected _gallery: HTMLElement;
    protected _basketCounter: HTMLElement;
    protected _basketButton: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._gallery = container.querySelector('.gallery')!;
        this._basketButton = container.querySelector('.header__basket')!;
        this._basketCounter = this._basketButton.querySelector('.header__basket-counter')!;
    }

    set counter(value: number) {
        this.setText(this._basketCounter, String(value));
    }

    get basketButton(): HTMLElement {
        return this._basketButton;
    }

    get gallery(): HTMLElement {
        return this._gallery;
    }
}