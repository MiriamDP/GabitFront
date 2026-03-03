import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  userName: string = '';
  userEmail: string = '';
  userFoto: string = '';

  menuItems = [
    { 
      icon: 'target', 
      label: 'Mis hábitos', 
      route: '/dashboard',
    },
    { 
      icon: 'trophy', 
      label: 'Logros', 
      route: '/logros',
    },
    { 
      icon: 'trending-up', 
      label: 'Biblioteca de hábitos', 
      route: '/biblioteca',
    },
    { 
      icon: 'users', 
      label: 'Comunidad', 
      route: '/comunidad',
    },
    { 
      icon: 'users', 
      label: 'Perfil', 
      route: '/perfil',
    }
  ];

  constructor(
    public authService: AuthService,
  ) {
    const user = this.authService.user();
    if (user) {
      this.userName = user.username || 'Usuario';
      this.userEmail = user.email || '';
      this.userFoto = user.photo || '';
    }
  }

  logout() {
    this.authService.logout();
  }
}