import { Payment, Error, IBuyer } from '../../types'

export class EndUser {
  private address: string = ""
  private payment: Payment | null = null
  private email: string = ""
  private phone: string = ""
  constructor() {}

  checkUserData(): Error[] {
    const errors: Error[] = []
    if (this.address === "") errors.push(new Error('Address is absent'))
    if (!this.payment) errors.push(new Error('Payment is absent'))
    if (this.email === "") errors.push(new Error('Email is manadatory'))
    if (this.phone === "") errors.push(new Error('Phone is manadatory'))
    return errors
  }
  getUserData(): IBuyer {
    return {
      address: this.address,
      payment: this.payment,
      email: this.email,
      phone: this. phone
    }
  }
  saveUserData(
    newData: Partial<IBuyer>
  ) {
    if (newData.address !== undefined) this.address = newData.address
    if (newData.payment) this.payment = newData.payment
    if (newData.email !== undefined) this.email = newData.email
    if (newData.phone !== undefined) this.phone = newData.phone
  }
  clearUserData() {
    this.address = ""
    this.payment = null
    this.email = ""
    this.phone = ""
  }
}
