import { Route } from '@angular/router';
import { OauthCallbackComponent } from './components/oauth-callback.component';
import { PlaylistsComponents } from './pages/playlists/playlists.components';
import { LayoutComponent } from './components/layout/LayoutComponent';
import { LoginComponent } from './pages/login-page/login.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: '', component: PlaylistsComponents }],
  },
  { path: 'login', component: LoginComponent },
  { path: 'oauth/callback', component: OauthCallbackComponent },
];
