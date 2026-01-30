import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingComponent } from './landing/landing.component';
import { HabitCreationComponent } from './habit-creation/habit-creation.component';
import { PublicAccessGuard } from './guards/public-access.guard';
import { UserLogGuard } from './guards/user-log.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {path: '', component: LandingComponent, canActivate:[PublicAccessGuard]},
  { path: 'login', component: LoginComponent, canActivate:[PublicAccessGuard] },
  { path: 'registro', component: RegisterComponent, canActivate:[PublicAccessGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate:[UserLogGuard]  },
  { path: 'crear-habito', component: HabitCreationComponent , canActivate:[UserLogGuard]},
  { path: 'perfil', component: UserProfileComponent , canActivate:[UserLogGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }