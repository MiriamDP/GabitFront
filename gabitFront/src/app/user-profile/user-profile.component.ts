import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../services/user-profile.service';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userLogged: User={
    idUser: 0,
    username: '',
    email: '',
    rol: '',
    photo: '',
    created_at: '',
    updated_at: ''
  }

  userNew: User={
    idUser: 0,
    username: '',
    email: '',
    rol: '',
    photo: '',
    created_at: '',
    updated_at: ''
  }
  

  constructor(private userSvc: UserProfileService, private authService: AuthService){}

  ngOnInit(): void {
    const userLogged=this.authService.user();
    if (userLogged){
      this.userLogged=userLogged;
      this.userNew=this.userLogged;
    }
  }

  updateUser(){

    this.userNew.username=this.userNew.username || this.userLogged.username;
    this.userNew.email=this.userNew.email || this.userLogged.email;
    this.userNew.photo=this.userNew.photo || this.userLogged.photo;

    const newData={
      username: this.userNew.username,
      email: this.userNew.email,
      photo: this.userNew.photo,
    }

    console.log(newData);

    console.log("Actualizando");
    this.userSvc.update(newData, this.userLogged.idUser);
  }
  
    onFileSelected(event: any) {
    const file = event.target.files[0];
    
    if (file) {
      // Validar tamaño 
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen es muy grande. Máximo 2MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        alert('Solo se permiten imágenes');
        return;
      }

      // Convertir a base64
      const reader = new FileReader();
      reader.onload = () => {
        this.userNew.photo = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  
}
