import { IBuyer } from "../../types/index";
import { TPayment } from "../../types/index";
import { IValidationResult,IValidationErrors } from "../../types/index";

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


validate(): IValidationResult {
  const errors: IValidationErrors = {};

  if (!this.payment) {
    errors.payment = 'Способ оплаты не выбран';
  }
  
  if (!this.phone || !this.phone.trim()) {
    errors.phone = 'Телефон не указан';
  }

  if (!this.email || !this.email.trim()) {
    errors.email = 'Email не указан';
  }

  if (!this.address || !this.address.trim()) {
    errors.address = 'Адрес не указан';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
}
