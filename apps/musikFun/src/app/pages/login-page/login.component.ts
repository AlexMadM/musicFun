import { Component, inject, OnDestroy } from '@angular/core';
import { Auth } from '@musik-fun/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  authLogin = inject(Auth);
  error: string | null = null;
  private router = inject(Router);
  private messageHandler = this.receiveMessage.bind(this);
  private authSubscription?: Subscription;

  loginHandler() {
    const redirectUri = `http://localhost:4200/oauth/callback`;
    const url = `https://musicfun.it-incubator.app/api/1.0/auth/oauth-redirect?callbackUrl=${redirectUri}`;
    window.open(url, 'oauthPopup', 'width=500,height=600');

    window.addEventListener('message', this.messageHandler);
  }

  private receiveMessage(event: MessageEvent) {
    if (event.origin !== 'http://localhost:4200') return;

    const { code } = event.data;
    if (code) {
      window.removeEventListener('message', this.messageHandler);

      // Отправляем код на сервер через AuthService
      this.authSubscription = this.authLogin
        .login({
          code,
          accessTokenTTL: '1d',
          redirectUri: `http://localhost:4200/oauth/callback`,
          rememberMe: true,
        })
        .subscribe({
          next: (res) => {
            // Обработка успешного логина
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('refreshToken', res.refreshToken);
          },
          error: (err) => {
            // Обработка ошибки
            console.log(err);
          },
        });
    }
  }

  ngOnDestroy() {
    window.removeEventListener('message', this.messageHandler);
    this.authSubscription?.unsubscribe();
  }
}
