export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }

  static badRequest(message = 'Bad request') {
    return new ApiError(400, message)
  }

  static unauthorized(message = 'Необходима авторизация') {
    return new ApiError(401, message)
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message)
  }

  static notFound(message = 'Not found') {
    return new ApiError(404, message)
  }
  static conflict(message = 'Конфликт данных') {
    return new ApiError(409, message)
  }
}
