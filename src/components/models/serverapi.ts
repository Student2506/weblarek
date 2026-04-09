import { IApi, IOrder, OrderResponse, ProductResponse } from '../../types'

export class ServerAPI {
  private api: IApi

  constructor(api: IApi) {
    this.api = api
  }

  async getProductList(): Promise<ProductResponse> {
    const data = await this.api.get<ProductResponse>(`/product/`)
    return data
  }
  async postOrder(order: IOrder): Promise<OrderResponse> {
    const response = await this.api.post<OrderResponse>(
      `/order/`,
      order,
      'POST',
    )
    console.log(`Response from server ${JSON.stringify(response)}`)
    return response
  }
}
