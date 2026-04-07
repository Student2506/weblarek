import { IApi } from '../../types'
import { Item } from '../../types/item'
import { Order } from '../../types/order'
import { ServerResponse } from '../../types/response'

export class ServerAPI {
  api: IApi

  constructor(api: IApi) {
    this.api = api
  }

  async getProductList(): Promise<ServerResponse> {
    try {
      const data = await this.api.get<Item>(`/product/`)
      return new ServerResponse(200, JSON.stringify(data))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return new ServerResponse(500, undefined, message)
    }
  }
  async getProductItem(id: string): Promise<ServerResponse> {
    try {
      const data = await this.api.get<Item>(`/product/${id}`)
      return new ServerResponse(200, JSON.stringify(data))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return new ServerResponse(500, undefined, message)
    }
  }
  async postOrder(order: Order): Promise<ServerResponse> {
    try {
      const response = await this.api.post<Order>(`/order/`, order, 'POST')
      console.log(`Response from server ${JSON.stringify(response)}`)
      return new ServerResponse(200, JSON.stringify(response))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return new ServerResponse(500, undefined, message)
    }
  }
}
