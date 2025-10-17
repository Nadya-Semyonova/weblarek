
import { Form } from './Form'; 
import { TPayment } from '../../types'; 
import { IEvents } from '../base/Events'; 

export class PaymentForm extends Form<TPayment> {
    protected _paymentButtons: HTMLButtonElement[]; 
    protected _addressInput: HTMLInputElement; 
     
    constructor(container: HTMLFormElement, events: IEvents) { 
        super(container, events); 
         
        this._paymentButtons = Array.from(container.querySelectorAll('.button_alt')); 
        this._addressInput = container.querySelector('input[name="address"]') as HTMLInputElement; 
 
        // ✅ Только события, без изменения состояния
        this._paymentButtons.forEach(button => { 
            button.addEventListener('click', () => { 
                this.events.emit('payment:changed', { 
                    payment: button.name as 'card' | 'cash' 
                }); 
            }); 
        }); 
 
        this._addressInput.addEventListener('input', () => { 
            this.events.emit('address:changed', { 
                address: this._addressInput.value 
            }); 
        }); 
         
        // ✅ Убрана лишняя логика, только событие отправки
        this.container.addEventListener('submit', (event) => { 
            event.preventDefault(); 
            this.events.emit('paymentForm:submit'); 
        }); 
    } 
 
    // ✅ Только отображение данных, полученных из презентера
    set payment(value: 'card' | 'cash' | null) { 
        this._paymentButtons.forEach(button => { 
            const isActive = button.name === value;
            button.classList.toggle('button_alt-active', isActive); 
        }); 
    } 
 
    set address(value: string) { 
        this._addressInput.value = value; 
    } 
 
    // ✅ Убрана валидация - только отображение состояния
    set valid(value: boolean) {
        this._valid = value;
        this.updateButtonState();
        
        // Визуальная индикация ошибок (только отображение)
        this._addressInput.classList.toggle('form__input-error', !value);
        this._paymentButtons.forEach(button => { 
            button.classList.toggle('button_alt-error', !value); 
        }); 
    }
 
    set errors(value: string) { 
        if (this._errors) { 
            this._errors.textContent = value; 
            this._errors.style.display = value ? 'block' : 'none'; 
        } 
    } 
 
    // ✅ Убраны абстрактные методы - форма не валидирует
    protected validate(): boolean { 
        return this._valid; // Просто возвращаем текущее состояние
    } 
 
    protected onInputChange(): void { 
        // Пустая реализация - валидация в презентере
    } 
}