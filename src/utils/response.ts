import type { Response } from 'express';

/**
 * Standard API response structure
 */
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
  pagination?: ApiResponse['pagination']
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    ...(pagination && { pagination }),
  };

  res.status(statusCode).json(response);
};

/**
 * Send success response without data
 */
export const sendSuccessMessage = (
  res: Response,
  message: string = 'Success',
  statusCode: number = 200
): void => {
  const response: Omit<ApiResponse, 'data'> = {
    success: true,
    message,
  };

  res.status(statusCode).json(response);
};

/**
 * Send paginated response
 */
export const sendPaginatedResponse = <T>(
  res: Response,
  data: T,
  pagination: ApiResponse['pagination'],
  message: string = 'Data retrieved successfully'
): void => {
  sendSuccess(res, data, message, 200, pagination);
};
