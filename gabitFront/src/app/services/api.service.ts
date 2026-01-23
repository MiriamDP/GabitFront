import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../interfaces/auth/auth-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Método para login, este devuelve un Observable de AuthResponse, 
  // que contiene el token y la información del usuario
  login(email: string, password: string): Observable<AuthResponse> {
    const url = `${this.baseUrl}/login`;
    return this.http.post<AuthResponse>(url, { email, password });
  }

  register(userData: any): Observable<AuthResponse> {
    const url = `${this.baseUrl}/register`;
    return this.http.post<AuthResponse>(url, userData);
  }

  logout(): Observable<any> {
    const url = `${this.baseUrl}/logout`;
    return this.http.post(url, {});
  }

  getUser(): Observable<any> {
    const url = `${this.baseUrl}/user`;
    return this.http.get(url);
  }
}