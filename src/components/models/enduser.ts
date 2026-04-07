import { IBuyer, Payment, Error } from '../../types'

export class EndUser implements IBuyer {
  address: string | null = null
  payment: Payment | null = null
  email: string | null = null
  phone: string | null = null

  constructor(
    address: string | null,
    payment: Payment | null,
    email: string | null,
    phone: string | null,
  ) {
    this.address = address
    this.payment = payment
    this.email = email
    this.phone = phone
  }

  checkUserData(): Error[] {
    const errors: Error[] = []
    if (!this.address) errors.push(new Error('Email is absent'))
    if (!this.payment) errors.push(new Error('Payment is absent'))
    if (!this.email && !this.phone)
      errors.push(new Error('Email or Phone is manadatory'))
    return errors
  }
  getUserData(): EndUser {
    return this
  }
  saveUserData(
    address: string | null,
    payment: Payment | null,
    email: string | null,
    phone: string | null,
  ) {
    if (address) this.address = address
    if (payment) this.payment = payment
    if (email) this.email = email
    if (phone) this.phone = phone
  }
  clearUserData() {
    this.address = null
    this.payment = null
    this.email = null
    this.phone = null
  }
}
