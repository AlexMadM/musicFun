import { Route } from '@angular/router';
import { OauthCallbackComponent } from './components/oauth-callback.component';
import { PlaylistsComponents } from './pages/playlists/playlists.components';

export const appRoutes: Route[] = [
  { path: 'oauth/callback', component: OauthCallbackComponent },
  { path: 'playlists', component: PlaylistsComponents },
];
