export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'

export interface IApi {
  get<T extends object>(uri: string): Promise<T>
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>
}
export interface IBuyer {
  address: string | null
  payment: Payment | null
  email: string | null
  phone: string | null
}

export interface IAdmin {
  rigths: string[]
}

export interface IOrder {
  payment: string
  email: string
  phone: string
  address: string
  total: number
  items: string[]

  getOrderJSON(): string
}

export interface IItem {
  id: string
  description: string
  image: string
  title: string
  category: string
  price: number | null
}

export type Payment = 'cash' | 'card'

export class Error {
  reason: string
  constructor(reason: string) {
    this.reason = reason
  }
}
