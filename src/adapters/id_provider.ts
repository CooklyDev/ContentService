import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

import { IdProvider } from '../services/interfaces/common';

@Injectable({ scope: Scope.REQUEST })
export class StubIdProvider implements IdProvider {
  constructor(@Inject(REQUEST) private readonly req: Request) {}

  getUserId(): string {
    const sessionId = this.req.get('X-Session-ID');

    if (!sessionId) {
      return ""
    }
    return sessionId
  }
}
