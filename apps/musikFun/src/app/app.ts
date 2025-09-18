import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import { LoginComponent } from './pages/login-page/login.component';

@Component({
  imports: [NxWelcome, RouterModule, LoginComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'musikFun';
}
