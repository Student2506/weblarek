import { Payment, IBuyer, ValidationErrors } from '../../types'

export class EndUser {
  private address: string = ""
  private payment: Payment | null = null
  private email: string = ""
  private phone: string = ""
  constructor() {}

  checkUserData(): ValidationErrors {
    const errors: ValidationErrors = {}
    if (this.address === "") errors["address"] = 'Address is absent'
    if (!this.payment) errors["payment"] = 'Payment is absent'
    if (this.email === "") errors["email"] = 'Email is manadatory'
    if (this.phone === "") errors["phone"] = 'Phone is manadatory'
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
