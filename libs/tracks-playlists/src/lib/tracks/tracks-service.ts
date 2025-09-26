import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FetchTracksArgs, FetchTracksResponse } from './types/tracksApi.types';

@Injectable({
  providedIn: 'root',
})
export class TracksService {
  htt = inject(HttpClient);
  private apiBaseUrl = 'https://musicfun.it-incubator.app/api/1.0';

  fetchTracks(args: FetchTracksArgs) {
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
    if (args.tagsIds?.length) {
      args.tagsIds.forEach((id) => {
        params = params.append('tagsIds', id);
      });
    }

    return this.htt.get<FetchTracksResponse>(
      `${this.apiBaseUrl}/playlists/tracks`,
      { params }
    );
  }
}
