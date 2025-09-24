import { Component, computed, Input, OnInit } from '@angular/core';
import { Cover, ImageType, Playlist } from '@musik-fun/playlists';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { SvgIconComponent } from '../../../../../../libs/common-ui/src/lib';
interface CoverLike {
  type: ImageType;
  url: string;
  width?: number;
  height?: number;
  fileSize?: number;
}

@Component({
  selector: 'app-playlist-card',
  imports: [NgOptimizedImage, DatePipe, SvgIconComponent],
  templateUrl: './playlist-card.component.html',
  styleUrl: './playlist-card.component.scss',
})
export class PlaylistCardComponent implements OnInit {
  @Input({ required: true }) playlist!: Playlist;
  readonly placeholderUrl = 'assets/no-cover-placeholder.avif';
  menuItems = [
    {
      icon: 'heart_fill',
    },
    {
      icon: 'heart-break',
    },
  ];
  title = computed(() => this.playlist?.attributes?.title || 'Без названия');

  covers = computed<CoverLike[]>(() => {
    const list = this.playlist?.attributes?.images?.main ?? [];
    return list.map((c: Cover) => ({
      type: c?.type as ImageType,
      url: String(c?.url ?? ''),
      width: typeof c?.width === 'number' ? c.width : undefined,
      height: typeof c?.height === 'number' ? c.height : undefined,
      fileSize: typeof c?.fileSize === 'number' ? c.fileSize : undefined,
    }));
  });

  // Удобный поиск по типу
  private byType = (t: ImageType) => this.covers().find((c) => c.type === t);

  // Выбор по приоритету (medium -> original -> thumbnail)
  selectedCover = computed<CoverLike | null>(
    () =>
      this.byType(ImageType.MEDIUM) ??
      this.byType(ImageType.ORIGINAL) ??
      this.byType(ImageType.THUMBNAIL) ??
      null
  );

  // URL выбранной обложки
  coverUrl = computed(() => {
    // если выбранная обложка есть — берём её url, иначе плейсхолдер
    return this.selectedCover()?.url ?? this.placeholderUrl;
  });

  // Размеры из массива для ORIGINAL (как на картинке), с безопасными дефолтами
  originalSize = computed(() => {
    const orig = this.byType(ImageType.ORIGINAL);
    return {
      width: orig?.width ?? 600,
      height: orig?.height ?? 600,
    };
  });

  // Общие размеры выбранной обложки: сначала берём реальные, иначе — дефолты
  coverSize = computed(() => {
    const c = this.selectedCover();
    if (c?.width && c?.height) {
      return { width: c.width, height: c.height };
    }
    // Если у выбранной нет размеров, но нужны именно ORIGINAL — можно взять из originalSize()
    if (c?.type === ImageType.ORIGINAL) {
      return this.originalSize();
    }
    // Иначе — мягкие дефолты по типу
    switch (c?.type) {
      case ImageType.THUMBNAIL:
        return { width: 48, height: 48 }; // как в примере на скрине
      case ImageType.MEDIUM:
        return { width: 248, height: 248 };
      default:
        return this.originalSize();
    }
  });

  ngOnInit() {
    console.log('covers (normalized):', this.covers());
    console.log('original size:', this.originalSize());
    console.log('selected cover:', this.selectedCover());
    console.log('coverUrl:', this.coverUrl());
    console.log('coverSize:', this.coverSize());
  }
}
