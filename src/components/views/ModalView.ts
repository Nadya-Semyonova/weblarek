import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IModalView {
    content: HTMLElement;
}

export class ModalView extends Component<IModalView> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
        this._content = container.querySelector('.modal__content') as HTMLElement;

        // Закрытие по кнопке X
        this._closeButton.addEventListener('click', () => this.close());

        // Закрытие по клику вне контента
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });

    }

    // Открытие модального окна с контентом
    open(content?: HTMLElement): void {
        if (content) {
            this._content.replaceChildren(content);
        }
        this.container.classList.add('modal_active');
        document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
    }

    // Закрытие модального окна
    close(): void {
        this.container.classList.remove('modal_active');
        document.body.style.overflow = ''; // Восстанавливаем скролл
        this.events.emit('modal:close');
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }
}