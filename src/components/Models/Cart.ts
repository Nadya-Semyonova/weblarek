import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Cart {
  private itemsArrayCart: IProduct[] = [];

  constructor(private events: IEvents) {} 

  getCartItems(): IProduct[] {
    return this.itemsArrayCart;
  }

  addToCart(product: IProduct): void {
    this.itemsArrayCart.push(product);
    this.events.emit('cart:changed')
  };

  removeFromCart(productId: string): void {
    this.itemsArrayCart = this.itemsArrayCart.filter((item) => item.id !== productId); 
    this.events.emit('cart:changed'); 
  }

  clearCart(): void {
    this.itemsArrayCart = []; 
    this.events.emit('cart:changed'); 
  }

  getTotalPrice(): number {
    return this.itemsArrayCart.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }

  getItemsCount(): number {
    return this.itemsArrayCart.length;
  }

  isInCart(productId: string): boolean {
    return this.itemsArrayCart.some((item) => item.id === productId);
  }
}
