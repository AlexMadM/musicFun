import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-oauth-callback',
  imports: [],
  templateUrl: './oauth-callback.component.html',
  styleUrl: './oauth-callback.component.css',
})
export class OauthCallbackComponent implements OnInit {
  ngOnInit(): void {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    // Можно добавить state, если он используется: const state = url.searchParams.get('state');

    if (code && window.opener) {
      // Лучше использовать точный origin вместо '*'
      window.opener.postMessage({ code }, '*'); // или другой origin
    }

    window.close();
  }
}
