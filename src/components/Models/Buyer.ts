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
    if (!this.email && !this.phone) {
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

  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.payment) {
        errors.push('Способ оплаты не выбран');
    }

    if (!this.address.trim()) {
        errors.push('Адрес не указан');
    }

    if (!this.phone.trim()) {
        errors.push('Телефон не указан');
    } 

    if (!this.email.trim()) {
        errors.push('Email не указан');
    } 

    return {
        isValid: errors.length === 0,
        errors,
    };
}
}