import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout-component',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './LayoutComponent.html',
  styleUrl: './LayoutComponent.scss',
})
export class LayoutComponent {}
