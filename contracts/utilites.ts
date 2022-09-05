export interface SuccessResponse<T> {
  message: string
  status: true
  payload: T
}

export interface ErrorResponse {
  message: string
  status: false
  errors: Array<{ field: string; message: string; rule: string }>
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse

declare module '@ioc:Adonis/Core/Response' {
  interface ResponseContract {
    sendApiResponse<T>(responseData: ApiResponse<T>): this
  }
}
