import { IProduct } from "../../types/index";

export class Cart {
  private itemsArrayCart: IProduct[] = [];

  getCartItems(): IProduct[] {
    return this.itemsArrayCart;
  }

  addToCart(product: IProduct): void {
    this.itemsArrayCart.push(product);
  }

  removeFromCart(productId: string): void {
    this.itemsArrayCart = this.itemsArrayCart.filter(
      (item) => item.id !== productId
    );
  }

  clearCart(): void {
    this.itemsArrayCart = [];
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
