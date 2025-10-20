import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Products {
  private itemsArray: IProduct[] = [];
  private card: IProduct | null = null;

  constructor(private events: IEvents) {}

  setCard(product: IProduct): void {
    this.card = product;
    this.events.emit('products:cardChanged');
  } 

  getCard(): IProduct | null {
    return this.card;
  }

  getItems(): IProduct[] {
    return this.itemsArray;
  }

  setItems(items: IProduct[]): void { 
    this.itemsArray = items; 
    this.events.emit('catalog:changed'); 
  } 

  getItemById(id: string): IProduct | undefined { 
    return this.itemsArray.find((item) => item.id === id); 
  } 
}