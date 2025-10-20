import { ensureElement } from "../../utils/utils"; 
import { IEvents } from "../base/Events"; 
import { Component } from "../base/Component";

interface IHeader {
  counter:number;
}
 
export class Header extends Component <IHeader> { 
    protected basketCounter: HTMLElement; 
    protected basketButton: HTMLElement; 
   
    constructor(protected events: IEvents, container: HTMLElement) { 
       super (container);
      this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container); 
      this.basketButton = ensureElement<HTMLButtonElement>('.header__basket'), this.container;  
       
       
       
      this.basketButton.addEventListener('click', () => { 
        events.emit('basket:open'); 
      }); 
    } 
   
    set counter(value: number) { 
      this.basketCounter.textContent = String(value); 
    } 
  } 