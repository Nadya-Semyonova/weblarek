import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface ISuccessView {
    total: number;
}

export class SuccessView extends Component<ISuccessView> {
    protected _description: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._description = container.querySelector('.order-success__description') as HTMLElement;
        this._closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;

        // Обработчик закрытия
        this._closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });

        // Закрытие по клику вне контента
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.events.emit('success:close');
            }
        });
    }

    set total(value: number) {
        this._description.textContent = `Списано ${value} синапсов`;

    }

    protected setText(element: HTMLElement, value: string): void {
        if (element) element.textContent = value;
    }

}