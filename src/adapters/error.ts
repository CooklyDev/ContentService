export class AdapterServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AdapterServerError';
    Object.setPrototypeOf(this, AdapterServerError.prototype);
  }
}

export class AdapterInvariantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AdapterInvariantError';
    Object.setPrototypeOf(this, AdapterInvariantError.prototype);
  }
}

export function IsAdapterServerError(
  error: Error,
): error is AdapterServerError {
  return error instanceof AdapterServerError;
}

export function IsAdapterInvariantError(
  error: Error,
): error is AdapterInvariantError {
  return error instanceof AdapterInvariantError;
}
