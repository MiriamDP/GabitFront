import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistryComponent } from './registry/registry.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistryComponent },
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }