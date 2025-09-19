import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-oauth-callback',
  imports: [],
  templateUrl: './oauth-callback.component.html',
})
export class OauthCallbackComponent implements OnInit {
  ngOnInit(): void {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    if (code && window.opener) {
      window.opener.postMessage({ code }, '*');
    }

    window.close();
  }
}
