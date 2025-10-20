import { Component } from '../base/Component'; 
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
 
interface IBasketView { 
    items: HTMLElement[]; 
    total: number; 
    buttonDisabled: boolean; 
    isEmpty: boolean; 
} 
 
export class BasketView extends Component<IBasketView> { 
    protected list: HTMLElement; 
    protected totalElement: HTMLElement; 
    protected button: HTMLButtonElement; 
   
 
    constructor(container: HTMLElement, protected events: IEvents) { 
        super(container); 
 
        this.list = ensureElement<HTMLElement>('.basket__list', this.container); 
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container); 
        this.button = ensureElement<HTMLButtonElement>('.basket__button',this.container); 
        
 
        // Обработчик оформления заказа 
        this.button.addEventListener('click', () => { 
            this.events.emit('basket:order'); 
        }); 
        // Инициализируем пустую корзину
        this.items = [];
    } 
 
    set items(items: HTMLElement[]) {
        if (items.length) {
          this.list.replaceChildren(...items);
          this.button.disabled = false;
        } else {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Корзина пуста';
            
            this.list.replaceChildren(emptyMessage);
            this.button.disabled = true;
        }


      }
    
    set total(total: number) {
        this.totalElement.textContent = `${total} синапсов`;
      } 

    }
      