import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  

  constructor(private api: ApiService, private router:Router) { }

  update(newData: any, id: number) {

    this.api.updateUser(newData, id).subscribe({
      next: (response)=>{
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
