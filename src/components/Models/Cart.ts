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
    this.events.emit('cart:itemAdded', { product, items: this.itemsArrayCart });
    this.events.emit('cart:changed', { 
      items: this.itemsArrayCart,
      totalPrice: this.getTotalPrice(),
      itemsCount: this.getItemsCount()
    });
  }

  removeFromCart(productId: string): void {
    const removedItem = this.itemsArrayCart.find(item => item.id === productId);
    this.itemsArrayCart = this.itemsArrayCart.filter((item) => item.id !== productId);
    
    if (removedItem) {
      this.events.emit('cart:itemRemoved', { 
        productId, 
        product: removedItem,
        items: this.itemsArrayCart 
      });
      this.events.emit('cart:changed', { 
        items: this.itemsArrayCart,
        totalPrice: this.getTotalPrice(),
        itemsCount: this.getItemsCount()
      });
    }
  }

  clearCart(): void {
    const clearedItems = [...this.itemsArrayCart];
    this.itemsArrayCart = [];
    
    this.events.emit('cart:cleared', { clearedItems });
    this.events.emit('cart:changed', { 
      items: this.itemsArrayCart,
      totalPrice: this.getTotalPrice(),
      itemsCount: this.getItemsCount()
    });
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
