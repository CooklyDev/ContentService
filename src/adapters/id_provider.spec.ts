import { UnauthorizedException } from '@nestjs/common';
import { jest } from '@jest/globals';
import { Request } from 'express';

import { StubIdProvider } from './id_provider';

describe('StubIdProvider', () => {
  it('should return session id from request header', () => {
    // Arrange
    const getHeader = jest.fn((headerName: string) =>
      headerName === 'X-Session-ID' ? 'session-id' : undefined,
    );
    const request = {
      get: getHeader,
    } as Pick<Request, 'get'> as Request;
    const provider = new StubIdProvider(request);

    // Act
    const userId = provider.getUserId();

    // Assert
    expect(userId).toBe('session-id');
    expect(getHeader).toHaveBeenCalledWith('X-Session-ID');
  });

  it('should throw when request header is missing', () => {
    // Arrange
    const request = {
      get: jest.fn(() => undefined),
    } as Pick<Request, 'get'> as Request;
    const provider = new StubIdProvider(request);

    // Act
    const action = () => provider.getUserId();

    // Assert
    expect(action).toThrow(UnauthorizedException);
  });
});
