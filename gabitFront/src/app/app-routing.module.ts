import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingComponent } from './landing/landing.component';
import { HabitCreationComponent } from './habit-creation/habit-creation.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HabitDetailComponent } from './habit-detail/habit-detail.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'crear-habito', component: HabitCreationComponent },
  { path: 'perfil', component: UserProfileComponent},
  { path: 'habito/:id', component: HabitDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }