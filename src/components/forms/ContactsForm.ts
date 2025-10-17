import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IBuyer } from '../../types';

export class ContactsForm extends Form<IBuyer> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        
        this._emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
        this._phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;
        
        // ✅ ТОЛЬКО СОБЫТИЯ
        this._emailInput.addEventListener('input', () => {
            this.events.emit('contacts:change', { 
                field: 'email', 
                value: this._emailInput.value 
            });
        });

        this._phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:change', { 
                field: 'phone', 
                value: this._phoneInput.value 
            });
        });

        // ✅ БЕЗ ПРОВЕРКИ VALID
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('ContactsForm:submit');
        });
    }

    // ✅ ТОЛЬКО ОТОБРАЖЕНИЕ ДАННЫХ
    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }

    // ✅ УПРОЩЕННАЯ ВАЛИДАЦИЯ (ТОЛЬКО ОТОБРАЖЕНИЕ)
    validate(): boolean {
        return this._valid;
    }

    protected onInputChange(): void {
        // Пустая реализация
    }

    // ✅ ОТОБРАЖЕНИЕ ОШИБОК И СОСТОЯНИЯ
    set valid(value: boolean) {
        this._valid = value;
        this.updateButtonState();
        
        // Визуальная индикация ошибок (только отображение)
        this._emailInput.classList.toggle('form__input-error', !value);
        this._phoneInput.classList.toggle('form__input-error', !value);
    }

    set errors(value: string) {
        if (this._errors) {
            this._errors.textContent = value;
            this._errors.style.display = value ? 'block' : 'none';
        }
    }
}