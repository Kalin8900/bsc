import { ApiError } from "@joinus/domain";

export const Errors = {
  MissingToken: 'Unauthorized',
  RequestValidationError: 'Request validation failed', 
} satisfies Record<string, ApiError['message']>