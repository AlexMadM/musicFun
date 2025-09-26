import { Component, input } from '@angular/core';
import {
  FetchTracksAttributes,
  FetchTracksResponse,
  TrackDetails,
} from '@musik-fun/tracks-playlists';
import { SvgIconComponent } from '../../../../../../libs/common-ui/src/lib';

@Component({
  selector: 'app-tracklist-card',
  imports: [SvgIconComponent],
  templateUrl: './tracklist-card.component.html',
  styleUrl: './tracklist-card.component.scss',
})
export class TracklistCardComponent {
  tracklist = input.required<TrackDetails<FetchTracksAttributes>>();
  menuItems = [
    {
      icon: 'heart_fill',
    },
    {
      icon: 'heart-break',
    },
  ];
}
