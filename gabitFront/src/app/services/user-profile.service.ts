import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private api: ApiService, private router:Router) { }

  update(user: User) {
    this.api.updateUser(user).subscribe({
      next: (response)=>{
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('userLogged', JSON.stringify(response.user));

        this.router.navigate(['/dashboard']);

      },
      error: (err)=>{
        console.error('Error al actualizar el usuario: ',err)
        return err;
      }
    });
  }
}
