
import { Form } from './Form';
import { TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class PaymentForm extends Form<TPayment> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;
    
    currentPayment: 'card' | 'cash' | null = null;
    currentAddress: string = '';

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        

        this._paymentButtons = Array.from(container.querySelectorAll('.button_alt'));
        this._addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;

 
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.name as 'card' | 'cash';
                this.events.emit('order:payment', { payment: button.name as 'card' | 'cash' });
                this.onInputChange();
            });
            this.onInputChange();
        });

        this._addressInput.addEventListener('input', () => {
            this.address = this._addressInput.value;
            this.events.emit('order:address', { address: this._addressInput.value });
            this.onInputChange();
        });
        this.onInputChange();
        
        
        this.initFormElements();
    }

    // Метод для инициализации после вставки в DOM
    initForm(): void {
        
        this.initFormElements();
        
        if (this._submitButton) {
            
            this.container.addEventListener('submit', (event) => {
                event.preventDefault();
                console.log('Форма оплаты отправлена, valid:', this.valid);
                if (this.valid) {
                    this.events.emit('PaymentForm:submit');
                }
            });
        }
        
        
        this.onInputChange();
    }

    set payment(value: 'card' | 'cash') {
        this.currentPayment = value;
        
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === value);
            button.classList.toggle('button_alt-error', false); 
        });
        
        this.onInputChange();
    }

    set address(value: string) {
        this.currentAddress = value.trim();
        this._addressInput.value = value;
        this.onInputChange();
    }

    protected onInputChange() {
        this.validate();
        this.updateButtonState(); 
    }

    validate(): boolean {
        const isPaymentSelected = this.currentPayment !== null;
        const isAddressValid = this.currentAddress.trim().length > 0;
    
        // Визуальная индикация ошибок
        this._addressInput.classList.toggle('form__input-error', !isAddressValid && this.currentAddress !== '');
        
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-error', !isPaymentSelected);
        });
    
        const errors: string[] = [];
        if (!isPaymentSelected) {
            errors.push('Выберите способ оплаты');
        }
        if (!isAddressValid) {
            errors.push('Введите адрес доставки');
        }
    
        this.errors = errors.join(', ');
        this.valid = isPaymentSelected && isAddressValid;
    
        return this.valid;
    }
}