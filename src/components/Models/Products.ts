import { IProduct } from "../../types/index";

export class Products {
  private itemsArray: IProduct[] = [];
  private card: IProduct | null = null;

  setCard(product: IProduct): void {
    this.card = product;
  }

  getCard(): IProduct | null {
    return this.card;
  }

  getItems(): IProduct[] {
    return this.itemsArray;
  }

  setItems(items: IProduct[]): void {
    this.itemsArray = items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.itemsArray.find((item) => item.id === id);
  }
}
