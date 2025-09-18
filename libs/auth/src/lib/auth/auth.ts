import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface OAuthLoginArgs {
  code: string;
  accessTokenTTL: string; // например '3m'
  redirectUri: string;
  rememberMe: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);

  apiBaseUrl = 'https://musicfun.it-incubator.app/api/1.0';

  accessToken: string | null = null;
  refreshToken: string | null = null;

  login(payload: OAuthLoginArgs) {
    return this.http
      .post<AuthTokensResponse>(`${this.apiBaseUrl}/auth/login`, payload)
      .pipe(tap((val) => this.saveTokens(val)));
  }

  saveTokens(res: AuthTokensResponse) {
    this.accessToken = res.accessToken;
    this.refreshToken = res.refreshToken;

    localStorage.setItem('accessToken', this.accessToken);
    localStorage.setItem('refreshToken', this.refreshToken);
  }
}
