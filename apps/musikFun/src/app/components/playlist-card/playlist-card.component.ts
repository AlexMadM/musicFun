import { Component, computed, Input } from '@angular/core';
import { ImageType, Playlist } from '@musik-fun/playlists';
import { DatePipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-playlist-card',
  imports: [NgOptimizedImage, DatePipe],
  templateUrl: './playlist-card.component.html',
  styleUrl: './playlist-card.component.scss',
})
export class PlaylistCardComponent {
  @Input({ required: true }) playlist!: Playlist;

  title = computed(() => this.playlist?.attributes?.title || 'Без названия');

  coverUrl = computed(() => {
    const covers = this.playlist?.attributes?.images?.main || [];
    const byType = (t: ImageType) => covers.find((c) => c.type === t)?.url;
    return (
      byType(ImageType.MEDIUM) ||
      byType(ImageType.ORIGINAL) ||
      byType(ImageType.THUMBNAIL) ||
      ''
    );
  });
}
