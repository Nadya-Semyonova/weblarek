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
this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('ContactsForm:submit');
        });
    }
set email(value: string) {
        this._emailInput.value = value;
    }
set phone(value: string) {
        this._phoneInput.value = value;
    }

}