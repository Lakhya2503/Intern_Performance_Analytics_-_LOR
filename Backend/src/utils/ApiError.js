class ApiError extends Error {
  constructor(statusCode, message = "Error", errors = [], stack = "") {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
