import { inject, Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { firstValueFrom, tap } from 'rxjs';

export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
}
export interface MeResponse {
  userId: string;
  login: string;
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
  user = signal<MeResponse | null>(null);

  accessToken: string | null = null;
  refreshToken: string | null = null;

  login(payload: OAuthLoginArgs) {
    return this.http
      .post<AuthTokensResponse>(`${this.apiBaseUrl}/auth/login`, payload)
      .pipe(tap((val) => this.saveTokens(val)));
  }
  me() {
    return this.http.get<MeResponse>(`${this.apiBaseUrl}/auth/me`);
  }

  async loadMe(): Promise<void> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.user.set(null);
      return;
    }
    try {
      const profile = await firstValueFrom(this.me());
      this.user.set(profile);
    } catch {
      this.user.set(null);
    }
  }


  saveTokens(res: AuthTokensResponse) {
    this.accessToken = res.accessToken;
    this.refreshToken = res.refreshToken;

    localStorage.setItem('accessToken', this.accessToken);
    localStorage.setItem('refreshToken', this.refreshToken);
  }
}
