import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

import {
  catchError,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';

import {
  FetchPlaylistsArgs,
  PlaylistService,
  PlaylistsResponse,
} from '@musik-fun/playlists';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { PlaylistCardComponent } from '../../components/playlist-card/playlist-card.component';

@Component({
  selector: 'app-playlists',
  imports: [FormsModule, AsyncPipe, PlaylistCardComponent],
  templateUrl: './playlists.components.html',
  styleUrl: './playlists.components.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistsComponents {
  private playlistService = inject(PlaylistService);

  // UI state
  search = signal<string>('');
  pageNumber = signal<number>(1);
  pageSize = signal<number>(20);
  sortBy = signal<'addedAt' | 'likesCount' | undefined>(undefined);
  sortDirection = signal<'asc' | 'desc' | undefined>(undefined);

  // триггер перезагрузки
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

  // состояние загрузки/ошибки/данных
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  playlists$: Observable<PlaylistsResponse> = this.args$.pipe(
    switchMap((args) => {
      this.loading.set(true);
      this.error.set(null);
      return this.playlistService.fetchPlaylists(args).pipe(
        map((res) => ({
          ...res,
          items: Array.isArray(res?.data) ? res.data.slice(0, 10) : [],
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
          } as unknown as PlaylistsResponse);
        })
      );
    }),
    // сбрасываем флаг загрузки после каждого результата
    map((res) => {
      this.loading.set(false);
      return res;
    })
  );

  // удобные вычисления для пагинации
  totalCount = signal<number>(0);
  totalPages = computed(() => {
    const size = this.pageSize();
    return size > 0 ? Math.max(1, Math.ceil(this.totalCount() / size)) : 1;
  });

  // Следим за ответом, чтобы вытащить totalCount (если есть)
  // Если в вашем PlaylistsResponse другое поле с общим числом — поправьте здесь
  constructor() {
    effect(() => {
      // эффект подписки только для totalCount
      // подписка через template async парсит данные, а это — локальный побочный эффект
      const sub = this.playlists$.subscribe((res: any) => {
        const total = typeof res?.totalCount === 'number' ? res.totalCount : 0;
        this.totalCount.set(total);
      });
      return () => sub.unsubscribe();
    });
  }

  onSearchChange(value: string) {
    this.search.set(value);
    this.pageNumber.set(1);
    this.reload();
  }

  nextPage() {
    if (this.pageNumber() < this.totalPages()) {
      this.pageNumber.update((n) => n + 1);
      this.reload();
    }
  }

  prevPage() {
    if (this.pageNumber() > 1) {
      this.pageNumber.update((n) => n - 1);
      this.reload();
    }
  }

  reload() {
    this.reload$.next();
  }
}
