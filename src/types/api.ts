import { ApiPostMethods, IApi } from '.'

export class API implements IApi {
  async get<T extends object>(uri: string): Promise<T> {
    const response = await fetch(uri, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP Error! status: ${response.status}`)
    }
    const data = await response.json()
    return data as T
  }
  async post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T> {
    const response = await fetch(uri, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`HTTP Error! status: ${response.status}`)
    }
    const serverResponse = await response.json()
    return serverResponse as T
  }
}
