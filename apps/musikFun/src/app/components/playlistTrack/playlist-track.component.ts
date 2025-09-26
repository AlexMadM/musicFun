import { Component, inject, signal } from '@angular/core';
import {
  FetchTracksResponse,
  TracksService,
} from '@musik-fun/tracks-playlists';
import {
  catchError,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { FetchPlaylistsArgs, PlaylistsResponse } from '@musik-fun/playlists';
import { TracklistCardComponent } from '../tracklist-card/tracklist-card.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-playlist-track',
  imports: [TracklistCardComponent, AsyncPipe],
  templateUrl: './playlist-track.component.html',
  styleUrl: './playlist-track.component.scss',
})
export class PlaylistTrackComponent {
  private tracService = inject(TracksService);

  search = signal<string>('');
  pageNumber = signal<number>(1);
  pageSize = signal<number>(10);
  sortBy = signal<'addedAt' | 'likesCount' | undefined>(undefined);
  sortDirection = signal<'asc' | 'desc' | undefined>(undefined);
  error = signal<string | null>(null);
  private reload$ = new Subject<void>();

  // соберём аргументы для запроса
  private args$ = this.reload$.pipe(
    startWith(void 0),
    map(
      (): FetchPlaylistsArgs => ({
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
        search: this.search() || undefined,
        sortBy: this.sortBy(),
        sortDirection: this.sortDirection(),
      })
    )
  );

  tracklists$: Observable<FetchTracksResponse> = this.args$.pipe(
    switchMap((args) => {
      return this.tracService.fetchTracks(args).pipe(
        map((res) => ({
          ...res,
          data: Array.isArray(res?.data) ? res.data.slice(0, 10) : [],
        })),
        catchError((err) => {
          const message =
            err?.error?.message ??
            err?.message ??
            'Не удалось загрузить плейлисты';
          this.error.set(message);
          return of({
            items: [],
            totalCount: 0,
          } as unknown as FetchTracksResponse);
        })
      );
    })
  );
}
