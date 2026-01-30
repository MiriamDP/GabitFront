import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS   } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';

// Importación de iconos de Lucide
import { 
  LucideAngularModule, 
  Target, TrendingUp, CircleCheckBig, Trophy, Flame, Plus, 
  TriangleAlert, FileText, Globe, ChartLine, LayoutTemplate,
  Earth, ChartColumnBig, Calendar1, Users, LogOut,
  // Nuevos iconos añadidos para la creación de hábitos
  Heart, Dumbbell, BookOpen, Palette, Brain, X, 
  ArrowLeft, Star, Check, CheckCheck, Inbox, ListChecks, Layers, Book, PersonStanding, Lock
} from 'lucide-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderPublicComponent } from './layout/header-public/header-public.component';
import { NavComponent } from './layout/nav/nav.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingComponent } from './landing/landing.component';
import { HabitCreationComponent } from './habit-creation/habit-creation.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HabitDetailComponent } from './habit-detail/habit-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderPublicComponent,
    NavComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    LandingComponent,
    HabitCreationComponent,
    UserProfileComponent,
    HabitDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    ReactiveFormsModule,      
    FormsModule,             
    HttpClientModule,
    AppRoutingModule,
    // Configuración de iconos disponibles en la app
    LucideAngularModule.pick({ 
      Target, TrendingUp, CircleCheckBig, Trophy, Flame, Plus, 
      TriangleAlert, FileText, Globe, ChartLine, LayoutTemplate,
      Earth, ChartColumnBig, Calendar1, Users, LogOut,
      // Iconos para Habits (Categorías y UI)
      Heart, Dumbbell, BookOpen, Palette, Brain, Star, Check, X,
      ArrowLeft, CheckCheck, Inbox, ListChecks, Layers, Book, PersonStanding, Lock
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }