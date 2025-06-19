import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Auth } from './features/auth/services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'recruita';

  constructor(protected authService: Auth, protected router: Router) {
  }

  shouldShowNavbar(): boolean {
    const hiddenRoutes = ['/login', '/sign-up', '/'];
    return this.authService.isLoggedIn() && !hiddenRoutes.includes(this.router.url);
  }
}
