import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  userName: string = '';
  userEmail: string = '';

  menuItems = [
    { 
      icon: 'target', 
      label: 'Mis hábitos', 
      route: '/dashboard',
      active: true 
    },
    { 
      icon: 'trophy', 
      label: 'Logros', 
      route: '/logros',
      active: false 
    },
    { 
      icon: 'trending-up', 
      label: 'Progreso', 
      route: '/progreso',
      active: false 
    },
    { 
      icon: 'users', 
      label: 'Comunidad', 
      route: '/comunidad',
      active: false 
    }
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.user();
    if (user) {
      this.userName = user.nombre || 'Usuario';
      this.userEmail = user.email || '';
    }
  }

  navigateTo(route: string) {
    this.menuItems.forEach(item => item.active = false);
    const clickedItem = this.menuItems.find(item => item.route === route);
    if (clickedItem) {
      clickedItem.active = true;
    }
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
  }
}