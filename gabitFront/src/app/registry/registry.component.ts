import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.css']
})
export class RegistryComponent {
  email: string = '';
  pass: string = '';
  passCon: string = '';
  nombreUsuario: string = '';
  
  constructor(private authService: AuthService) { }

  registerForm() {
    this.authService.register(this.nombreUsuario, '', this.email, this.nombreUsuario, this.pass);
  };
}
