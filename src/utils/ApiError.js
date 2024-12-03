/**
* Inheritance Error object to custom status, name
*/
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;