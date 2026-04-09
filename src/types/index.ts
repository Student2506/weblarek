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
  address: string
  payment: Payment | null
  email: string
  phone: string
}

export interface IOrder extends IBuyer {
  total: number
  items: string[]

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
export type ValidationErrors = Partial<Record<keyof IBuyer, string>>