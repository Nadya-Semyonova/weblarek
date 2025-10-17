import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Form<T> extends Component<T> {
    protected _submitButton: HTMLButtonElement | null = null;
    protected _errors: HTMLElement | null = null;
    protected _valid: boolean = false;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.initFormElements();
    }

// Метод для инициализации после вставки в DOM
    initFormElements(): void {
        
    
        this._submitButton = this.container.querySelector('button[type="submit"]');
        this._errors = this.container.querySelector('.form__errors');
        
        if (this._submitButton && this._submitButton.disabled) {
            this.updateButtonState();
        }
    }

    set valid(value: boolean) {
        this._valid = value;
        this.updateButtonState();
    }

    set errors(value: string) {
        if (this._errors) {
            this._errors.textContent = value;
            this._errors.style.display = value ? 'block' : 'none';
        }
    }
    protected updateButtonState(): void {
        if (this._submitButton) {
            this._submitButton.disabled = !this._valid;
            console.log('Обновление состояния кнопки:', {
                valid: this._valid,
                disabled: this._submitButton.disabled,
                button: this._submitButton
            });
        }
    }
    protected validate(): boolean { 
        return this._valid;
    }
    
    protected onInputChange(): void {
        // Базовая реализация
    }
}