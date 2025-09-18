import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  FetchPlaylistsArgs,
  PlaylistsResponse,
} from './types/playlistsApi.types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  http = inject(HttpClient);
  private apiBaseUrl = 'https://musicfun.it-incubator.app/api/1.0';

  fetchPlaylists(
    args: FetchPlaylistsArgs = {} as FetchPlaylistsArgs
  ): Observable<PlaylistsResponse> {
    let params = new HttpParams();

    if (args.pageSize != null)
      params = params.set('pageSize', String(args.pageSize));
    if (args.pageNumber != null)
      params = params.set('pageNumber', String(args.pageNumber));
    if (args.search) params = params.set('search', args.search);
    if (args.sortBy) params = params.set('sortBy', args.sortBy);
    if (args.sortDirection)
      params = params.set('sortDirection', args.sortDirection);
    if (args.userId) params = params.set('userId', args.userId);
    if (args.trackId) params = params.set('trackId', args.trackId);
    if (args.tagsIds?.length) {
      args.tagsIds.forEach((id) => {
        params = params.append('tagsIds', id);
      });
    }

    return this.http.get<PlaylistsResponse>(`${this.apiBaseUrl}/playlists`, {
      params,
    });
  }
}
