export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class TargetNotFountError extends Error {
  constructor(
    public readonly target: string,
    message = `${target} not found`,
  ) {
    super(message);
    this.name = 'TargetNotFountError';
    Object.setPrototypeOf(this, TargetNotFountError.prototype);
  }
}

export class InvalidInput extends Error {
  constructor(
    public readonly input: string,
    message = `Invalid ${input}`,
  ) {
    super(message);
    this.name = 'InvalidInput';
    Object.setPrototypeOf(this, InvalidInput.prototype);
  }
}

export class TargetAlreadyExists extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TargetAlreadyExists';
    Object.setPrototypeOf(this, TargetAlreadyExists.prototype);
  }
}

export function IsUnauthorizedError(error: Error): error is UnauthorizedError {
  return error instanceof UnauthorizedError;
}

export function IsTargetNotFountError(
  error: Error,
): error is TargetNotFountError {
  return error instanceof TargetNotFountError;
}

export function IsInvalidInput(error: Error): error is InvalidInput {
  return error instanceof InvalidInput;
}

export function IsTargetAlreadyExists(
  error: Error,
): error is TargetAlreadyExists {
  return error instanceof TargetAlreadyExists;
}
