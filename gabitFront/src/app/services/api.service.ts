import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../interfaces/auth/auth-response';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = 'aqui ira la url de la api cuando exista';

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    const url = `${this.baseUrl}/login`;
    return this.http.post<AuthResponse>(url, { email, password }
    );
  }

  register(email: string, password: string) {
    const url = `${this.baseUrl}/register`;
    return this.http.post<AuthResponse>(url, { email, password }
    );
  }
}
