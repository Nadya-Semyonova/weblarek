
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
         
        
        this.container.addEventListener('submit', (event) => { 
            event.preventDefault(); 
            this.events.emit('paymentForm:submit'); 
        }); 
    } 
 
    
    set payment(value: 'card' | 'cash' | "") { 
        this._paymentButtons.forEach(button => { 
            const isActive = button.name === value;
            button.classList.toggle('button_alt-active', isActive); 
        }); 
    } 
 
    set address(value: string) { 
        this._addressInput.value = value; 
    } 
 
   
    set valid(value: boolean) {
        this._valid = value;
        this.updateButtonState();
        
        // Визуальная индикация ошибок 
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
 
   
    protected validate(): boolean { 
        return this._valid; 
    } 
 
    protected onInputChange(): void { 
        
    } 
}