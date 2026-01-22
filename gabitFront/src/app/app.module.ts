import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Importación de iconos de Lucide
import { 
  LucideAngularModule, 
  Target, TrendingUp, CircleCheckBig, Trophy, Flame, Plus, 
  TriangleAlert, FileText, Globe, ChartLine, LayoutTemplate,
  Earth, ChartColumnBig, Calendar1, Users, LogOut,
  // Nuevos iconos añadidos para la creación de hábitos
  Heart, Dumbbell, BarChart2, BookOpen, Palette, Brain, Star, Check, X 
} from 'lucide-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderPublicComponent } from './layout/header-public/header-public.component';
import { NavComponent } from './layout/nav/nav.component';
import { LoginComponent } from './login/login.component';
import { RegistryComponent } from './registry/registry.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingComponent } from './landing/landing.component';
import { HabitCreationComponent } from './habit-creation/habit-creation.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderPublicComponent,
    NavComponent,
    LoginComponent,
    RegistryComponent,
    DashboardComponent,
    LandingComponent,
    HabitCreationComponent
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
      Heart, Dumbbell, BarChart2, BookOpen, Palette, Brain, Star, Check, X
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }