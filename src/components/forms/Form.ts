import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement | null = null;
    protected _errors: HTMLElement | null = null;
    

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);
        
        this.submitButton = this.container.querySelector('button[type="submit"]');
        this._errors = this.container.querySelector('.form__errors');
    }  
    
    set valid(value: boolean) { 
        if (this.submitButton) { 
            this.submitButton.disabled = !value; 
        } 
    }

   set errors(value: string) {
        if (this._errors) {
            this._errors.textContent = value;
            
        }
    }
    
    protected updateButtonState(): void { 
        if (this.submitButton) { 
            this.submitButton.disabled = !this.valid; 
            console.log('Обновление состояния кнопки:', { 
                disabled: this.submitButton.disabled, 
                button: this.submitButton 
            }); 
        } 
    } 
    
}