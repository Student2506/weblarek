import { IEndUser, IItem, IOrder } from ".";

export class Order implements IOrder {
  items: IItem[];
  user: IEndUser;

  constructor (items: IItem[], user: IEndUser) {
    this.items = items;
    this.user = user;
  }
}