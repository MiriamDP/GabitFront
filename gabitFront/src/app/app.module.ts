import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS   } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';

//esto es una prueba

// Importación de iconos de Lucide
import { 
  LucideAngularModule, 
  Target, TrendingUp, CircleCheckBig, Trophy, Flame, Plus, 
  TriangleAlert, FileText, Globe, ChartLine, LayoutTemplate,
  Earth, ChartColumnBig, Calendar1, Users, LogOut,
  // Nuevos iconos añadidos para la creación de hábitos
  Heart, Dumbbell, BookOpen, Palette, Brain, X, 
  ArrowLeft, Star, Check, CheckCheck, Inbox, ListChecks, Layers, Book, PersonStanding, Lock, Zap, CircleCheck, CircleAlert
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
import { AchievementComponent } from './achievement/achievement.component';
import { HabitHeaderComponent } from './habit-detail/components/habit-header/habit-header.component';
import { HabitLevelsComponent } from './habit-detail/components/habit-levels/habit-levels.component';
import { MissionListComponent } from './habit-detail/components/mission-list/mission-list.component';
import { MissionCardComponent } from './habit-detail/components/mission-card/mission-card.component';
import { LevelUpModalComponent } from './habit-detail/components/level-up-modal/level-up-modal.component';
import { AchievementModalComponent } from './habit-detail/components/achievement-modal/achievement-modal.component';
import { LevelDetailComponent } from './habit-detail/components/level-detail/level-detail.component';
import { ConfirmModalComponent } from './shared/confirm-modal/confirm-modal.component';
import { HabitLibraryComponent } from './habit-library/habit-library.component';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEs);

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
    HabitDetailComponent,
    AchievementComponent,
    HabitHeaderComponent,
    HabitLevelsComponent,
    MissionListComponent,
    MissionCardComponent,
    LevelUpModalComponent,
    AchievementModalComponent,
    LevelDetailComponent,
    ConfirmModalComponent,
    HabitLibraryComponent,
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
      ArrowLeft, CircleCheck, CircleAlert, Inbox, ListChecks, Layers, Book, PersonStanding, Lock, Zap
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },{
      provide: LOCALE_ID,
      useValue:'es-ES'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }