import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-layout-component',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './LayoutComponent.html',
  styleUrl: './LayoutComponent.scss',
})
export class LayoutComponent {}
