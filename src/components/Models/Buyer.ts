import { IBuyer } from "../../types/index"; 
import { TPayment } from "../../types/index"; 
import { IValidationResult, IValidationErrors } from "../../types/index"; 
import { IEvents } from "../base/Events"; 

export class Buyer { 
  // Поля класса 
  private payment: TPayment | "" = ""; 
  private address: string = ""; 
  private phone: string = ""; 
  private email: string = ""; 

  constructor(private events: IEvents) {} 

   getBuyerData(): IBuyer { 
    return { 
      payment: this.payment as TPayment, 
      address: this.address, 
      phone: this.phone, 
      email: this.email, 
    }; 
  } 
setBuyerData(buyerData: Partial<IBuyer>): void { 

    if (buyerData.payment !== undefined && this.payment !== buyerData.payment) { 
      this.payment = buyerData.payment; 
      this.events.emit('buyer:paymentChanged', { payment: this.payment });
    } 
    
    if (buyerData.address !== undefined && this.address !== buyerData.address) { 
      this.address = buyerData.address; 
      this.events.emit('buyer:addressChanged', { address: this.address });
    } 
    
    if (buyerData.phone !== undefined && this.phone !== buyerData.phone) { 
      this.phone = buyerData.phone; 
      this.events.emit('buyer:phoneChanged', { phone: this.phone });
    } 
    
    if (buyerData.email !== undefined && this.email !== buyerData.email) { 
      this.email = buyerData.email; 
      this.events.emit('buyer:emailChanged', { email: this.email });
    } 

  } 

  clearData(): void { 
    this.payment = ""; 
    this.address = ""; 
    this.phone = ""; 
    this.email = ""; 
    
    this.events.emit('buyer:cleared');
    
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


