import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { firstValueFrom } from 'rxjs';

import { IdProvider } from '../services/interfaces/common.js';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

interface ResolveSessionResponse {
  user_id: string;
}

@Injectable({ scope: Scope.REQUEST })
export class StubIdProvider implements IdProvider {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    private readonly http: HttpService,
    private configService: ConfigService,
  ) {}

  async getUserId(): Promise<string> {
    const sessionId = this.req.get('X-Session-ID');

    if (!sessionId) {
      throw new UnauthorizedException('Missing X-Session-ID header');
    }

    const authUrl = this.configService.getOrThrow<string>('auth.url');
    const resolveEndpoint = this.configService.getOrThrow<string>(
      'auth.session_resolve_endpoint',
    );

    try {
      const response = await firstValueFrom(
        this.http.post<ResolveSessionResponse>(authUrl + resolveEndpoint, {
          session_id: sessionId,
        }),
      );

      return response.data.user_id;
    } catch {
      throw new UnauthorizedException('Invalid session ID');
    }
  }
}
