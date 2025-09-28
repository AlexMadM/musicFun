import { Injectable, signal, computed } from '@angular/core';

export interface Track {
  url: string;
  title: string;
  artist: string;
  cover?: string;
  duration?: number;
}

export type RepeatMode = 'off' | 'one' | 'all';

export interface PlayerError {
  type: 'network' | 'format' | 'permission' | 'unknown';
  message: string;
  track?: Track;
}

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService {
  private audio = new Audio();

  // Состояние плеера через signals
  private trackSignal = signal<Track | null>(null);
  private isPlayingSignal = signal<boolean>(false);
  private currentTimeSignal = signal<number>(0);
  private durationSignal = signal<number>(0);
  private volumeSignal = signal<number>(0.7);

  // Очередь и режимы
  private queue: Track[] = [];
  private indexSignal = signal<number>(-1);
  private shuffleSignal = signal<boolean>(false);
  private repeatModeSignal = signal<RepeatMode>('off');
  
  // Состояние загрузки и ошибок
  private isLoadingSignal = signal<boolean>(false);
  private errorSignal = signal<PlayerError | null>(null);

  // Публичные signals
  track = this.trackSignal.asReadonly();
  isPlaying = this.isPlayingSignal.asReadonly();
  currentTime = this.currentTimeSignal.asReadonly();
  duration = this.durationSignal.asReadonly();
  volume = this.volumeSignal.asReadonly();
  queueIndex = this.indexSignal.asReadonly();
  isShuffle = this.shuffleSignal.asReadonly();
  repeatMode = this.repeatModeSignal.asReadonly();
  isLoading = this.isLoadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  // Computed signals для производных состояний
  hasTrack = computed(() => !!this.track());
  isQueueEmpty = computed(() => this.queue.length === 0);
  canGoNext = computed(() => {
    const currentIndex = this.queueIndex();
    const repeatMode = this.repeatMode();
    return !this.isQueueEmpty() && (currentIndex < this.queue.length - 1 || repeatMode === 'all');
  });
  canGoPrev = computed(() => {
    const currentIndex = this.queueIndex();
    const repeatMode = this.repeatMode();
    return !this.isQueueEmpty() && (currentIndex > 0 || repeatMode === 'all');
  });

  private listenersInitialized = false;

  constructor() {
    // Только базовая инициализация
    this.audio.volume = this.volumeSignal();
  }

  // Ленивая инициализация слушателей - только когда нужно
  private ensureListenersInitialized(): void {
    if (this.listenersInitialized) return;
    
    this.setupAudioEventListeners();
    this.listenersInitialized = true;
  }

  // Инициализация слушателей событий
  private setupAudioEventListeners(): void {
    this.audio.addEventListener('timeupdate', () => {
      this.currentTimeSignal.set(this.audio.currentTime);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      const dur = Number.isFinite(this.audio.duration)
        ? this.audio.duration
        : 0;
      this.durationSignal.set(dur);
    });

    this.audio.addEventListener('play', () => {
      this.isPlayingSignal.set(true);
    });

    this.audio.addEventListener('pause', () => {
      this.isPlayingSignal.set(false);
    });

    this.audio.addEventListener('seeked', () => {
      this.currentTimeSignal.set(this.audio.currentTime);
    });

    this.audio.addEventListener('volumechange', () => {
      this.volumeSignal.set(this.audio.volume);
    });

    this.audio.addEventListener('ended', () => {
      this.handleEnded();
    });

    // Обработка ошибок
    this.audio.addEventListener('error', (event) => {
      this.handleError(event);
    });

    this.audio.addEventListener('loadstart', () => {
      this.isLoadingSignal.set(true);
      this.errorSignal.set(null);
    });

    this.audio.addEventListener('canplay', () => {
      this.isLoadingSignal.set(false);
    });
  }


  // API управления

  async loadQueue(
    tracks: Track[],
    startIndex = 0,
    autoplay = true
  ): Promise<void> {
    this.queue = Array.isArray(tracks) ? tracks.slice() : [];
    const idx = Math.min(
      Math.max(0, startIndex),
      Math.max(0, this.queue.length - 1)
    );
    await this.setTrackByIndex(idx, autoplay);
  }

  async setTrackByIndex(index: number, autoplay = true): Promise<void> {
    if (!this.queue.length || index < 0 || index >= this.queue.length) {
      this.clear();
      return;
    }
    const track = this.queue[index];
    this.indexSignal.set(index);
    await this.setTrack(track, autoplay);
  }

  async setTrack(track: Track, autoplay = true): Promise<void> {
    // Инициализируем слушатели только при первом использовании
    this.ensureListenersInitialized();
    
    this.trackSignal.set(track);
    this.audio.src = track.url;
    this.audio.load();

    // Если знаем duration заранее
    if (typeof track.duration === 'number' && Number.isFinite(track.duration)) {
      this.durationSignal.set(track.duration);
    } else {
      this.durationSignal.set(0);
    }

    this.currentTimeSignal.set(0);

    if (autoplay) {
      await this.play();
    }
  }

  // Совместимость со старым API
  playTrack(track: Track) {
    return this.setTrack(track, true);
  }

  async play(): Promise<void> {
    // Инициализируем слушатели при первом воспроизведении
    this.ensureListenersInitialized();
    
    try {
      await this.audio.play();
      this.isPlayingSignal.set(true);
    } catch {
      this.isPlayingSignal.set(false);
    }
  }

  pause(): void {
    this.audio.pause();
    this.isPlayingSignal.set(false);
  }

  async togglePlayPause(): Promise<void> {
    if (this.isPlayingSignal()) {
      this.pause();
    } else {
      await this.play();
    }
  }

  seek(time: number): void {
    const dur = this.durationSignal();
    const safeTime = Math.max(
      0,
      Math.min(Number.isFinite(dur) ? dur : Infinity, Number(time) || 0)
    );
    this.audio.currentTime = safeTime;
    this.currentTimeSignal.set(safeTime);
  }

  setVolume(vol: number): void {
    const safe = Math.max(0, Math.min(1, Number(vol) || 0));
    this.audio.volume = safe;
    this.volumeSignal.set(safe);
  }

  // Очередь / навигация

  async next(): Promise<void> {
    if (!this.queue.length) return;

    const repeat = this.repeatModeSignal();
    const currentIndex = this.indexSignal();

    // repeat one — просто переигрываем текущий
    if (repeat === 'one' && currentIndex !== -1) {
      await this.setTrackByIndex(currentIndex, true);
      return;
    }

    let nextIndex = currentIndex;

    if (this.shuffleSignal()) {
      // случайный индекс, стараемся не повторять текущий если длина > 1
      if (this.queue.length > 1) {
        do {
          nextIndex = Math.floor(Math.random() * this.queue.length);
        } while (nextIndex === currentIndex);
      }
    } else {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex >= this.queue.length) {
      if (repeat === 'all') {
        nextIndex = 0;
      } else {
        // конец без повторения
        this.pause();
        this.audio.currentTime = 0;
        this.currentTimeSignal.set(0);
        return;
      }
    }

    await this.setTrackByIndex(nextIndex, true);
  }

  async prev(): Promise<void> {
    if (!this.queue.length) return;

    const currentIndex = this.indexSignal();
    let prevIndex = currentIndex;

    if (this.shuffleSignal()) {
      if (this.queue.length > 1) {
        do {
          prevIndex = Math.floor(Math.random() * this.queue.length);
        } while (prevIndex === currentIndex);
      }
    } else {
      // если прошло мало времени — прыгнем в начало текущего, иначе — к предыдущему
      if (this.audio.currentTime > 3) {
        this.seek(0);
        return;
      }
      prevIndex = currentIndex - 1;
    }

    if (prevIndex < 0) {
      if (this.repeatModeSignal() === 'all') {
        prevIndex = this.queue.length - 1;
      } else {
        this.seek(0);
        return;
      }
    }

    await this.setTrackByIndex(prevIndex, true);
  }

  toggleShuffle(): void {
    this.shuffleSignal.set(!this.shuffleSignal());
  }

  cycleRepeatMode(): void {
    const current = this.repeatModeSignal();
    const next: RepeatMode =
      current === 'off' ? 'all' : current === 'all' ? 'one' : 'off';
    this.repeatModeSignal.set(next);
  }

  // Внутреннее: поведение на окончание трека
  private async handleEnded(): Promise<void> {
    if (!this.queue.length) {
      this.isPlayingSignal.set(false);
      this.currentTimeSignal.set(0);
      return;
    }
    await this.next();
  }

  // Обработка ошибок
  private handleError(event: Event): void {
    this.isLoadingSignal.set(false);
    const audio = event.target as HTMLAudioElement;
    const error = audio.error;
    const currentTrack = this.trackSignal();
    
    let playerError: PlayerError;
    
    if (error) {
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          playerError = {
            type: 'network',
            message: 'Загрузка прервана',
            track: currentTrack || undefined
          };
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          playerError = {
            type: 'network',
            message: 'Ошибка сети при загрузке трека',
            track: currentTrack || undefined
          };
          break;
        case MediaError.MEDIA_ERR_DECODE:
          playerError = {
            type: 'format',
            message: 'Ошибка декодирования аудио',
            track: currentTrack || undefined
          };
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          playerError = {
            type: 'format',
            message: 'Формат аудио не поддерживается',
            track: currentTrack || undefined
          };
          break;
        default:
          playerError = {
            type: 'unknown',
            message: 'Неизвестная ошибка воспроизведения',
            track: currentTrack || undefined
          };
      }
    } else {
      playerError = {
        type: 'unknown',
        message: 'Ошибка воспроизведения',
        track: currentTrack || undefined
      };
    }
    
    this.errorSignal.set(playerError);
    this.isPlayingSignal.set(false);
  }

  // Очистка ошибок
  clearError(): void {
    this.errorSignal.set(null);
  }

  // Очистка плеера/состояния
  clear(): void {
    this.audio.pause();
    this.audio.src = '';
    this.trackSignal.set(null);
    this.isPlayingSignal.set(false);
    this.currentTimeSignal.set(0);
    this.durationSignal.set(0);
    this.indexSignal.set(-1);
    this.isLoadingSignal.set(false);
    this.errorSignal.set(null);
  }

  // Очистка ресурсов (для предотвращения утечек памяти)
  destroy(): void {
    this.audio.pause();
    this.audio.src = '';
    this.audio.load(); // Сбрасываем состояние audio элемента
    
    // Signals не требуют явной очистки, но можем сбросить состояние
    this.clear();
  }
}
