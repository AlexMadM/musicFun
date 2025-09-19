import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgIconComponent } from '../../../../../../libs/common-ui/src/lib';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, SvgIconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  menuItems = [
    {
      label: 'Home',
      icon: 'home',
      link: '/',
    },
    {
      label: 'Your Library',
      icon: 'lib',
      link: 'myPlaylists',
    },
    {
      label: 'Create Playlist',
      icon: 'create',
      link: 'createPlaylist',
    },
    {
      label: 'Upload Track',
      icon: 'upload',
      link: 'uploadTrack',
    },
    {
      label: 'All Tracks',
      icon: 'tracks',
      link: 'allTracks',
    },
    {
      label: 'All Playlist',
      icon: 'playlist',
      link: 'allPlaylist',
    },
  ];
}
