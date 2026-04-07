import { IApi } from '.'
import { Item } from './item'
import { Order } from './order'
import { ServerResponse } from './response'

export class ServerAPI {
  baseURL: string
  api: IApi

  constructor(baseUrl: string, api: IApi) {
    this.baseURL = baseUrl
    this.api = api
  }

  async getProductList(): Promise<ServerResponse> {
    try {
      const data = await this.api.get<Item>(`${this.baseURL}/product/`)
      return new ServerResponse(200, JSON.stringify(data))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return new ServerResponse(500, undefined, message)
    }
  }
  async getProductItem(id: string): Promise<ServerResponse> {
    try {
      const data = await this.api.get<Item>(`${this.baseURL}/product/${id}`)
      return new ServerResponse(200, JSON.stringify(data))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return new ServerResponse(500, undefined, message)
    }
  }
  async postOrder(order: Order): Promise<ServerResponse> {
    try {
      const response = await this.api.post<Order>(
        `${this.baseURL}/order/`,
        order,
        'POST',
      )
      console.log(`Response from server ${JSON.stringify(response)}`)
      return new ServerResponse(200, JSON.stringify(response))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return new ServerResponse(500, undefined, message)
    }
  }
}
