import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IBuyer } from '../../types';

export class ContactsForm extends Form<IBuyer> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    
    public currentEmail: string = '';
    public currentPhone: string = '';
    

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        
        this._emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
        this._phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;
        this._emailInput.addEventListener('input', () => {
            this.email = this._emailInput.value;
            this.events.emit('contacts:change', { field: 'email', value: this._emailInput.value });
        });

        this._phoneInput.addEventListener('input', () => {
            this.phone = this._phoneInput.value;
            this.events.emit('contacts:change', { field: 'phone', value: this._phoneInput.value });
        });

        // Добавляем обработчик отправки формы
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log('Форма контактов отправлена, valid:', this.valid);
            if (this.valid) {
                this.events.emit('ContactsForm:submit');
            }
        });

        this.onInputChange();
    }

    // Метод для инициализации после вставки в DOM
    initForm(): void {
        this.initFormElements();
        this.onInputChange(); 
    }

    set email(value: string) {
        this.currentEmail = value.trim();
        this._emailInput.value = this.currentEmail;
        this.onInputChange();
    }

    set phone(value: string) {
        this.currentPhone = value.trim();
        this._phoneInput.value = this.currentPhone;
        this.onInputChange();
    }

    protected onInputChange() {
        this.validate();
        this.updateButtonState(); 
    }

    validate(): boolean {
        const isEmailValid = this.currentEmail.trim().length > 0 && this.isValidEmail(this.currentEmail);
        const isPhoneValid = this.currentPhone.trim().length > 0;

        // Визуальная индикация ошибок
        this._emailInput.classList.toggle('form__input-error', !isEmailValid && this.currentEmail !== '');
        this._phoneInput.classList.toggle('form__input-error', !isPhoneValid && this.currentPhone !== '');

        const errors: string[] = [];
        if (!isEmailValid) {
            errors.push('Введите корректный email');
        }
        if (!isPhoneValid) {
            errors.push('Введите номер телефона');
        }

        this.errors = errors.join(', ');
        this.valid = isEmailValid && isPhoneValid;

        return this.valid;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}