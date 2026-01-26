import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';



//PARA QUE SIRVE EL INTERCEPTOR
// ESTE CODIGO SE EJECUTA ANTES DE CADA PETICION HTTP QUE HAGA LA APLICACION
// SU FUNCION PRINCIPAL ES AÑADIR EL TOKEN DE AUTENTICACION A LAS PETICIONES
// SINO, HABRIA QUE AÑADIRLO MANUALMENTE EN CADA RESPUESTA HTTP QUE HICIERAMOS EN EL API SERVICE
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
    }
    
    return next.handle(request);
  }
}