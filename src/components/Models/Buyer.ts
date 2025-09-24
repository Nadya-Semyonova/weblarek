import { IBuyer } from "../../types/index";
import { TPayment } from "../../types/index";

export class Buyer {
  // Поля класса
  private payment: TPayment | "" = "";
  private address: string = "";
  private phone: string = "";
  private email: string = "";

  // Методы
  getBuyerData(): IBuyer | null {
    if (!this.isValid()) {
      return null;
    }

    return {
      payment: this.payment as TPayment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  setBuyerData(buyerData: Partial<IBuyer>): void {
    if (buyerData.payment !== undefined) {
      this.payment = buyerData.payment;
    }
    if (buyerData.address !== undefined) {
      this.address = buyerData.address;
    }
    if (buyerData.phone !== undefined) {
      this.phone = buyerData.phone;
    }
    if (buyerData.email !== undefined) {
      this.email = buyerData.email;
    }
  }

  clearData(): void {
    this.payment = "";
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  isValid(): boolean {
    return (
      this.payment !== "" &&
      this.address.trim() !== "" &&
      this.phone.trim() !== "" &&
      this.email.trim() !== ""
    );
  }
}
