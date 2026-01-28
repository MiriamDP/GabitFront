import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../services/user-profile.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User={
    idUser: '',
    name: '',
    lastName: '',
    username: '',
    email: '',
    password: null,
    passwordCon: null,
    photo: ''
  }

  constructor(private userSvc: UserProfileService){}

  ngOnInit(): void {
    const userLogged=localStorage.getItem("userLogged");
    if (userLogged){
      this.user=JSON.parse(userLogged) as User;
    }
  }

  updateUser(){
    this.userSvc.update(this.user);
  }
  

  
}
