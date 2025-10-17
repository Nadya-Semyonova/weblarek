import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Products {
  private itemsArray: IProduct[] = [];
  private card: IProduct | null = null;

  constructor(private events: IEvents) {}

  setCard(product: IProduct): void {
    const changed = this.card !== product;
    if (!changed) return;

    const previousCard = this.card;
    this.card = product;
    
    this.events.emit('products:cardChanged', { 
      previous: previousCard,
      current: this.card 
    });
  }

  getCard(): IProduct | null {
    return this.card;
  }

  getItems(): IProduct[] {
    return this.itemsArray;
  }

  setItems(items: IProduct[]): void {
    // Проверяем, действительно ли изменились items
    const isSame = items.length === this.itemsArray.length && 
                   items.every((item, index) => item.id === this.itemsArray[index]?.id);
    if (isSame) return;

    this.itemsArray = items;
    this.events.emit('products:itemsChanged', { items: this.itemsArray });
    this.events.emit('catalog:changed');
  }

  getItemById(id: string): IProduct | undefined {
    return this.itemsArray.find((item) => item.id === id);
  }
}
