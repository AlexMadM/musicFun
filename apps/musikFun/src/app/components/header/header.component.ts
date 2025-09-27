import { Component, inject, signal } from '@angular/core';
import { LoginComponent } from '../../pages/login-page/login.component';
import { Auth } from '@musik-fun/auth';

@Component({
  selector: 'app-header',
  imports: [LoginComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private auth = inject(Auth);

  // Сигналы
  user = this.auth.user;
  menuOpen = signal(false);

  constructor() {
    // Один раз подтянуть текущего пользователя
    void this.auth.loadMe();
  }

}
