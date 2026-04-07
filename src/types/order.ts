import { IEndUser, IOrder } from ".";
import { Basket } from "./basket";

export class Order implements IOrder {
  payment: string
  email: string
  phone: string
  address: string
  total: number
  items: string[]


  constructor (basket: Basket, user: IEndUser) {
    this.payment = user.payment!!;
    this.email = user.email!!;
    this.phone = user.phone!!;
    this.address = user.address!!;
    this.total = basket.itemsAmount();
    this.items = basket.getItemsList().map(item => item.id);
  }

  getOrderJSON(): string {
    const order = {
      "payment": this.payment,
      "email": this.email,
      "phone": this.phone,
      "address": this.address,
      "total": this.total,
      "items": this.items
    }
    return JSON.stringify(order);
  }
}