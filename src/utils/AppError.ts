import httpStatus from 'http-status';

/**
 * Custom Application Error class for operational errors
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    stack: string = ''
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Create a Bad Request error (400)
   */
  static badRequest(message: string = 'Bad Request'): AppError {
    return new AppError(httpStatus.BAD_REQUEST, message);
  }

  /**
   * Create an Unauthorized error (401)
   */
  static unauthorized(message: string = 'Unauthorized'): AppError {
    return new AppError(httpStatus.UNAUTHORIZED, message);
  }

  /**
   * Create a Forbidden error (403)
   */
  static forbidden(message: string = 'Forbidden'): AppError {
    return new AppError(httpStatus.FORBIDDEN, message);
  }

  /**
   * Create a Not Found error (404)
   */
  static notFound(message: string = 'Not Found'): AppError {
    return new AppError(httpStatus.NOT_FOUND, message);
  }

  /**
   * Create a Conflict error (409)
   */
  static conflict(message: string = 'Conflict'): AppError {
    return new AppError(httpStatus.CONFLICT, message);
  }

  /**
   * Create an Internal Server Error (500)
   */
  static internal(message: string = 'Internal Server Error'): AppError {
    return new AppError(httpStatus.INTERNAL_SERVER_ERROR, message);
  }
}
