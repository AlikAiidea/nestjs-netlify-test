/**
 * @description: Interface for response
 * @param T data the data to be returned if the request is successful.
 * @param boolean success status of the request.
 * @param string message to be returned if the request is not successful.
 */
export interface IResponse<T> {
  data?: T
  success: boolean
  message?: string
}
