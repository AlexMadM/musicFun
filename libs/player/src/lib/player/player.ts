import { Component, inject, HostListener, OnInit, OnDestroy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AudioPlayerService, Track } from '../service/audio-player-service';

@Component({
  selector: 'lib-player',
  imports: [AsyncPipe],
  templateUrl: './player.html',
  styleUrl: './player.scss',
})
export class Player implements OnInit, OnDestroy {
  private readonly player = inject(AudioPlayerService);

  // Современный подход: используем signals напрямую
  track = this.player.track;
  isPlaying = this.player.isPlaying;
  currentTime = this.player.currentTime;
  duration = this.player.duration;
  volume = this.player.volume;
  isShuffle = this.player.isShuffle;
  repeatMode = this.player.repeatMode;
  isLoading = this.player.isLoading;
  error = this.player.error;

  // Используем computed signals из сервиса
  hasTrack = this.player.hasTrack;
  canGoNext = this.player.canGoNext;
  canGoPrev = this.player.canGoPrev;

  // Трек по умолчанию: используется, если пользователь нажал Play, а трек еще не выбран
  private readonly defaultTrack: Track = {
    url: 'https://musicfun.it-incubator.app/api/samurai-way-soundtrack.mp3',
    title: 'Samurai Way (Default)',
    artist: 'MusicFun',
    cover: '', // можно указать URL обложки, если есть
    // duration: можно не указывать — подтянется из metadata
  };

  ngOnInit(): void {
    // Проверяем поддержку уведомлений
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  ngOnDestroy(): void {
    // Очистка ресурсов при уничтожении компонента
    this.player.destroy();
  }

  togglePlay() {
    if (!this.hasTrack()) {
      // Если ничего не выбрано — ставим и запускаем трек по умолчанию
      void this.player.setTrack(this.defaultTrack, true);
      return;
    }
    // Иначе обычное переключение play/pause
    void this.player.togglePlayPause();
  }

  // ... existing code ...
  prev() {
    void this.player.prev();
  }

  next() {
    void this.player.next();
  }

  toggleShuffle() {
    this.player.toggleShuffle();
  }

  toggleRepeat() {
    this.player.cycleRepeatMode();
  }

  seek(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    this.player.seek(input.valueAsNumber);
  }

  setVolume(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    this.player.setVolume(input.valueAsNumber);
  }

  // Обработка ошибок
  clearError() {
    this.player.clearError();
  }

  // Показ уведомлений
  private showNotification(title: string, body: string, icon?: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        tag: 'music-player'
      });
    }
  }

  // Хелпер форматирования
  formatTime(sec: number | undefined | null): string {
    if (!sec || Number.isNaN(sec)) return '0:00';
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  // Получение иконки для режима повтора
  getRepeatIcon(): string {
    const mode = this.repeatMode();
    switch (mode) {
      case 'one': return '🔂';
      case 'all': return '🔁';
      default: return '🔁';
    }
  }

  // Получение текста для режима повтора
  getRepeatTitle(): string {
    const mode = this.repeatMode();
    switch (mode) {
      case 'one': return 'Повтор: один трек';
      case 'all': return 'Повтор: все треки';
      default: return 'Повтор: выключен';
    }
  }

  // Обработка клавиатурных сокращений
  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    // Игнорируем если фокус на input элементах
    if (event.target instanceof HTMLInputElement) {
      return;
    }

    switch (event.code) {
      case 'Space':
        event.preventDefault();
        this.togglePlay();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.prev();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.next();
        break;
      case 'KeyM':
        event.preventDefault();
        this.toggleShuffle();
        break;
      case 'KeyR':
        event.preventDefault();
        this.toggleRepeat();
        break;
      case 'Escape':
        if (this.error()) {
          this.clearError();
        }
        break;
    }
  }
}
