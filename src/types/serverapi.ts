import { ApiPostMethods, IApi } from ".";
import { Item } from "./item";
import { Order } from "./order";
import { ServerResponse } from "./response";

export class ServerAPI implements IApi {
  baseURL: string

  constructor(baseUrl: string) {
    this.baseURL = baseUrl;
  }
  async get<T extends object>(uri: string): Promise<T> {
    const response = await fetch(uri, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP Error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as T;
  }
  async post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T> {
    const response = await fetch(uri, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP Error! status: ${response.status}`);
    }
    const serverResponse = await response.json();
    return serverResponse as T;
  }
  async getProductList(): Promise<ServerResponse> {
    try {
      const data = await this.get<Item>(`${this.baseURL}/product/`);
      return new ServerResponse(200, JSON.stringify(data));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return new ServerResponse(500, undefined, message);
    }
  }
  async getProductItem(id: string): Promise<ServerResponse> {
    try {
      const data = await this.get<Item>(`${this.baseURL}/product/${id}`);
      return new ServerResponse(200, JSON.stringify(data));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return new ServerResponse(500, undefined, message);
    }
  }
  async postOrder(order: Order): Promise<ServerResponse> {
    try {
      const response = await this.post<Order>(`${this.baseURL}/order/`, order, "POST");
      console.log(`Response from server ${response}`);
      return new ServerResponse(200, JSON.stringify(response));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return new ServerResponse(500, undefined, message);
    }
  }
}