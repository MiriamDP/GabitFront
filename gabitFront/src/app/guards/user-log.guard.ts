import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class UserLogGuard{
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      // NO está logueado → redirigimos al login
      this.router.navigate(['/login']);
      return false;
    } else {
      // Ya está logueado → le dejamos estar en las paginas de usuario
      return true;
    }
  }
  
}
