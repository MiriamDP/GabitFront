import { ApplicationConfig, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn = signal<boolean>(false);

  public user = signal<any>(null);

  constructor(
    // private api: ApiService,
    private router: Router
  ) { 
    const user=localStorage.getItem('userLogged');
    if(user){
      console.log(user);
      this.user.set(JSON.parse(user));
      this.isLoggedIn.set(true);
    }
  }

  login(email: string, password: string) {
  //ahora mismo como no hay api usamos los que estan en el registro local
    const users: any[] = JSON.parse(localStorage.getItem("usersReg") || '[]');
    const userFind = users.find(u => u.email === email && u.password === password);

    if (userFind) {
      this.isLoggedIn.set(true);
      this.user.set(userFind);
      localStorage.setItem('userLogged', JSON.stringify(userFind));
      this.router.navigate(['/dashboard']);
    } else {
      this.isLoggedIn.set(false);
      this.user.set(null);
      console.error('Email o contraseña incorrectos');
    }

      //cuando exista api deberia funcionar lo de abajo
      // this.api.login(email, password)
      // .subscribe({
      //   next: (response) => {
      //     if (response.ok) {
      //       this.isLoggedIn.set(true);
      //       this.user.set(response.user);
      //       localStorage.setItem('userLogged',JSON.stringify(response.user));
      //       this.router.navigate(['/dashboard']);
      //     } else {
      //       this.isLoggedIn.set(false);
      //       this.user.set(null);
      //     }
      //   },
      //   error: () => {
      //     this.isLoggedIn.set(false);
      //     this.user.set(null);
      //   }
      // });
  }

  register(email: string, password: string, passwordConf:string) {
    this.registroMock(email,password,passwordConf);
    // this.api.register(email, password)
    //   .subscribe({
    //     next: (response) => {
    //       if (response.ok) {
    //         this.router.navigate(['/login']);
    //       }
    //     },
    //     error: () => {
    //       console.error('Error en el registro');
    //     }
    //   });
  }

  logout() {
    this.isLoggedIn.set(false);
    this.user.set(null);
    localStorage.removeItem('userLogged');
    this.router.navigate(['/login']); //deberia redirigir a la landing de gabit o se puede dejar login consultar con Carmen
  }

  //La siguiente funcion es solamente para un registro mokeado debera desaparecer
registroMock(email: string, password: string, passwordConf: string): boolean {
  let usersReg: any[] = JSON.parse(localStorage.getItem("usersReg") || '[]');

  if (!email || !password || !passwordConf) {
    console.error('Faltan datos');
    return false;
  }

  if (password !== passwordConf) {
    console.error('Las contraseñas no coinciden');
    return false;
  }

  let emailExists = false;
  usersReg.forEach(user => {
    if (user.email === email) {
      emailExists = true;
    }
  });

  if (emailExists) {
    console.error('Usuario ya registrado');
    return false;
  }

  let id=1;
  if(usersReg.length>0){
    id=usersReg.length+1;
  }

  const newUser = {
    id: id,
    email: email,
    password: password,
    name: 'Usuario'+id
  };

  usersReg.push(newUser);
  localStorage.setItem("usersReg", JSON.stringify(usersReg));

  this.router.navigateByUrl('/login');

  console.log('Usuario registrado correctamente:', newUser);
  return true;
}

}
