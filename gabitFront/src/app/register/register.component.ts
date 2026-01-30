import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  pass: string = '';
  passCon: string = '';
  username: string = '';
  photo: string = ''; 
  
  constructor(private authService: AuthService) { }

  // Método para cuando seleccionas un archivo
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
        this.photo = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  registerForm() {
    // Validar que las contraseñas coincidan
    if (this.pass !== this.passCon) {
      alert('Las contraseñas no coinciden');
      return;
    }
    this.authService.register(
      this.email, 
      this.username, 
      this.pass, 
      this.photo
    );
  }
}