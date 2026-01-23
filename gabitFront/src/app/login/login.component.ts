import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  loginForm() {
  this.errorMessage = '';
  if (!this.email || !this.password) {
    this.errorMessage = 'Por favor completa todos los campos';
    return;
  }

    this.authService.login(this.email, this.password);
  }
}