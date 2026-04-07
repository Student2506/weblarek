export class ServerResponse {
  status_code: number
  data?: string
  error?: string

  constructor (status_code: number, data?: string, error?: string) {
    this.status_code = status_code;
    this.data = data;
    this.error = error;
  }
}

