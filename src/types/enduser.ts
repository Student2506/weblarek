import { IEndUser, IOrder, Payment, Error } from '.'

export class EndUser implements IEndUser {
  address: string | null = null
  orders: IOrder[] = []
  payment: Payment | null = null
  email: string | null = null
  phone: string | null = null

  checkUserData(): Error[] {
    const errors: Error[] = []
    if (!this.address) errors.push(new Error('Email is absent'))
    if (!this.payment) errors.push(new Error('Payment is absent'))
    if (!this.email && !this.phone)
      errors.push(new Error('Email or Phone is manadatory'))
    if (!this.orders.length) errors.push(new Error('Order list is empty'))
    return errors
  }
  getUserData(): EndUser {
    return this
  }
  saveUserData(user: EndUser) {
    if (user.address) this.address = user.address
    if (user.payment) this.payment = user.payment
    if (user.email) this.email = user.email
    if (user.phone) this.phone = user.phone
    if (user.orders.length >= 0) this.orders = user.orders
  }
  clearUserData() {
    this.address = null
    this.orders = []
    this.payment = null
    this.email = null
    this.phone = null
  }
}
