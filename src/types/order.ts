import { IBuyer, IOrder, Payment } from '.'
import { Basket } from '../components/models/basket'

export class Order implements IOrder {
  payment: Payment | null
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


}
