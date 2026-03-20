export class BusinessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessError';
    Object.setPrototypeOf(this, BusinessError.prototype);
  }
}

export function IsBusinessError(error: Error): error is BusinessError {
  return error instanceof BusinessError;
}
