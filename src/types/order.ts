import { IBuyer, IOrder, Payment } from '.'
import { Basket } from '../components/models/basket'

export class Order implements IOrder {
  payment: string
  email: string
  phone: string
  address: string
  total: number
  items: string[]

  constructor(basket: Basket, user: IBuyer, payment: Payment) {
    this.payment = payment
    this.email = user.email!
    this.phone = user.phone!
    this.address = user.address!
    this.total = basket.itemsAmount()
    this.items = basket.getItemsList().map((item) => item.id)
  }

  getOrderJSON(): string {
    const order = {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
      total: this.total,
      items: this.items,
    }
    return JSON.stringify(order)
  }
}
