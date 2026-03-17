import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {


  constructor(private api: ApiService, private router: Router, private AuthService: AuthService) { }

  update(newData: any, id: number) {

    this.api.updateUser(newData, id).subscribe({
      next: (response) => {
        localStorage.setItem('userLogged', JSON.stringify(response.user));

        this.router.navigate(['/dashboard']);

      },
      error: (err) => {
        console.error('Error al actualizar el usuario: ', err)
        return err;
      }
    });
  }
  delete(id: number) {
    this.api.deleteUser(id).subscribe({
      next: (response) => {
        console.log("Usuario eliminado: ", response);
        this.AuthService.isLoggedIn.set(false);
        this.AuthService.user.set(null);
        localStorage.removeItem("userLogged");
        localStorage.removeItem("token");
        this.router.navigate(["/login"]);
      },
      error: (err) => {
        console.error("Error al eliminar el usuario: ", err);
      }
    });
  }
}
