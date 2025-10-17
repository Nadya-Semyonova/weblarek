import { ensureElement } from "../../utils/utils"; 
import { IEvents } from "../base/Events"; 
 
export class Header { 
    protected basketCounter: HTMLElement; 
    protected basketButton: HTMLElement; 
   
    constructor(events: IEvents, container: HTMLElement) { 
       
      this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', container); 
      this.basketButton = container;  
       
       
       
      this.basketButton.addEventListener('click', () => { 
        events.emit('basket:open'); 
      }); 
    } 
   
    set counter(value: number) { 
      this.basketCounter.textContent = value.toString(); 
    } 
  } 