import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../interfaces/auth/auth-response';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { UserResponse } from '../interfaces/user-response';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }


  login(email: string, password: string): Observable<AuthResponse> {
    //El endpoint de login
    const url = `${this.baseUrl}/login`;
    //Hacemos la peticion POST al endpoint de login con el email y password, el interceptor se encargara de 
    // añadir el token a la peticion y asi en cada respuesta HTTP que hagamos. 
    return this.http.post<AuthResponse>(url, { email, password });
  }

  // Método para registro de usuario
  register(userData: any): Observable<AuthResponse> {
    //El endpoint de registro
    const url = `${this.baseUrl}/register`;
    return this.http.post<AuthResponse>(url, userData);
  }

  logout(): Observable<any> {
    //El endpoint de logout
    const url = `${this.baseUrl}/logout`;
    return this.http.post(url, {});
  }

  getUser(): Observable<any> {
    //El endpoint para obtener la información del usuario autenticado
    const url = `${this.baseUrl}/user`;
    return this.http.get(url);
  }

  updateUser(newData: any, id: number): Observable<UserResponse> {
    //Endpoint para actualizar al usuario logeado
    const url = `${this.baseUrl}/user/${id}`;
    return this.http.put<UserResponse>(url, newData);
  }
}