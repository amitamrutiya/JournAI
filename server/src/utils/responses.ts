import { Response } from "express";

/**
 * Standard API response format
 */
export interface StandardResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  timestamp: string;
}

/**
 * Sends a success response
 */
export const sendSuccess = (
  res: Response,
  data: any = null,
  message: string = "Success",
  statusCode: number = 200
): void => {
  const response: StandardResponse = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
};

/**
 * Sends an error response
 */
export const sendError = (
  res: Response,
  message: string = "An error occurred",
  statusCode: number = 500,
  error?: string
): void => {
  const response: StandardResponse = {
    success: false,
    message,
    error,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
};
