import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn = signal<boolean>(false);
  public user = signal<any>(null);

  constructor(
    private api: ApiService,
    private router: Router
  ) { 
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('userLogged');
    
    // Guardamos el token de sesión y el usuario si existen
    if (token && user) {
      this.user.set(JSON.parse(user));
      this.isLoggedIn.set(true);
    }
  }

  // Método para iniciar sesión
  login(email: string, password: string) {
    // Llamada al API para login
    this.api.login(email, password)
    //Subscribirse a la respuesta dela API
      .subscribe({
        next: (response) => {
          // Guardar token y usuario
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('userLogged', JSON.stringify(response.user));
          
          // Actualizar signals, estamos logueados y guardamos el usuario
          this.isLoggedIn.set(true);
          this.user.set(response.user);
          
          // Redirigimos al dashboard
          this.router.navigate(['/dashboard']);
        },
        //Si hay un error en el login, limpiamos el estado, signals y mostramos el error en consola
        error: (err) => {
          this.isLoggedIn.set(false);
          this.user.set(null);
          console.error('Error en login:', err);
          return err;
        }
      });
  }

  register(nombre: string, apellidos: string, email: string, nombreUsuario: string, password: string) {
    const userData = {
      nombre,
      apellidos,
      email,
      nombreUsuario,
      password
    };
    
    this.api.register(userData)
      .subscribe({
        next: (response) => {
          // Auto-login después del registro
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('userLogged', JSON.stringify(response.user));
          
          this.isLoggedIn.set(true);
          this.user.set(response.user);
          
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error en el registro:', err);
        }
      });
  }

  logout() {
    this.api.logout().subscribe({
      next: () => {
        this.isLoggedIn.set(false);
        this.user.set(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userLogged');
        this.router.navigate(['/login']);
      },
      error: () => {
        // Aunque falle el logout en el backend, limpiamos local
        this.isLoggedIn.set(false);
        this.user.set(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userLogged');
        this.router.navigate(['/login']);
      }
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}