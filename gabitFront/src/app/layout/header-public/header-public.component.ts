import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header-public',
  templateUrl: './header-public.component.html',
  styleUrls: ['./header-public.component.css']
})
export class HeaderPublicComponent {

  isLoggedIn = this.authService.isLoggedIn;
  usuario = this.authService.user;

  constructor(private authService: AuthService) { }

  logout(): void {
    this.authService.logout();
  }
}
