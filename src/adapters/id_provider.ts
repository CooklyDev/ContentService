import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { firstValueFrom } from 'rxjs';

import { IdProvider } from '../services/interfaces/common.js';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

interface ResolveSessionResponse {
  data: {
    UserID: string;
  };
  error: {
    code: string;
    message: string;
  } | null;
  success: boolean;
}

@Injectable({ scope: Scope.REQUEST })
export class RestIdProvider implements IdProvider {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    private readonly http: HttpService,
    private configService: ConfigService,
  ) {}

  async getUserId(): Promise<string | null> {
    const sessionId = this.req.get('X-Session-ID');

    if (!sessionId) {
      return null;
    }

    const authUrl = this.configService.getOrThrow<string>('AUTH_URL');
    const resolveEndpoint = this.configService.getOrThrow<string>(
      'AUTH_SESSION_RESOLVE_ENDPOINT',
    );
    const formData = new URLSearchParams();
    formData.append('session_id', sessionId);

    try {
      const response = await firstValueFrom(
        this.http.post<ResolveSessionResponse>(
          authUrl + resolveEndpoint,
          formData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      if (!response.data.success) {
        return null;
      }

      return response.data.data.UserID || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
