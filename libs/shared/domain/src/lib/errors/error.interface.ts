export interface Errors {
  errors?: string[];
}

export interface ApiError extends Errors {
  statusCode: number;
  message: string;
  name: string;
}
