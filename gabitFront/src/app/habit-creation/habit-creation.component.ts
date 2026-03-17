import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { HabitService } from '../services/habit.service';
import { Category } from '../interfaces/habit/habit.interface';

@Component({
  selector: 'app-habit-creation',
  templateUrl: './habit-creation.component.html',
  styleUrls: ['./habit-creation.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HabitCreationComponent implements OnInit {
  //Control de pasos del formulario
  currentStep = 1;
  totalSteps = 4;
  habitForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;

  availableColors = [
    '#3B82F6', '#1D4ED8', '#6366F1', '#A855F7',
    '#10B981', '#14B8A6', '#84CC16', '#EC4899',
    '#F97316', '#F59E0B', '#EF4444', '#64748B'
  ];

  categories: Category[] = [];

  missionTypes = [
    { value: 'diaria', label: 'Diaria' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'unica', label: 'Única' }
  ];

  constructor(
    private fb: FormBuilder,
    private habitService: HabitService,
    private router: Router
  ) { }

  ngOnInit(): void {
    //Carga categorias desde el backend
    this.loadCategories();
    //inicializa el formulario reactivo
    this.initForm();
  }

  //Función para cargar categorías desde el backend
  loadCategories(): void {
    this.isLoading = true;
    this.habitService.getCategories().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.categories = response.data;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error(' Error al cargar categorías:', error);
        this.isLoading = false;
      }
    });
  }

  //Inicializa el formulario reactivo con validaciones
  initForm(): void {
    //Definición de la estructura del formulario
    this.habitForm = this.fb.group({
      basicInfo: this.fb.group({
        //Nombre del hábito minimo 3 caracteres
        name: ['', [Validators.required, Validators.minLength(3)]],
        //Descripción del hábito minimo 10 caracteres
        description: ['', [Validators.required, Validators.minLength(10)]],
        //Categoría del hábito obligatoria
        category: ['', Validators.required],
        //Color del hábito con valor por defecto
        color: ['#3B82F6', Validators.required],
        //Visibilidad del hábito
        isPublic: [false]
      }),
      //Niveles del hábito, por defecto 3 niveles, minimo 1 maximo 10
      levels: this.fb.group({
        numberOfLevels: [3, [Validators.required, Validators.min(1), Validators.max(10)]],
        //Detalles de cada nivel, nombre y puntos requeridos
        levelDetails: this.fb.array([])
      }),
      //Misiones del hábito y su estructura y logros
      missions: this.fb.array([]),
      achievements: this.fb.array([])
    });
    //Inicializa los niveles por defecto
    this.updateLevels(3);
  }

  //GETTERS
  get basicInfo(): FormGroup {
    return this.habitForm.get('basicInfo') as FormGroup;
  }

  get levelsGroup(): FormGroup {
    return this.habitForm.get('levels') as FormGroup;
  }

  get levelDetails(): FormArray {
    return this.levelsGroup.get('levelDetails') as FormArray;
  }

  get missions(): FormArray {
    return this.habitForm.get('missions') as FormArray;
  }

  get achievements(): FormArray {
    return this.habitForm.get('achievements') as FormArray;
  }

  //Navegación entre pasos del formulario
  nextStep(): void {
    if (this.currentStep < this.totalSteps && this.isCurrentStepValid()) {
      this.currentStep++;
    }
  }

  //Navega al paso anterior del formulario
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  //Navega a un paso específico del formulario
  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  //Valida si el paso actual es válido antes de avanzar
  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.basicInfo.valid;
      case 2:
        return this.levelsGroup.valid;
      case 3:
        return this.missions.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  }

  //Actualiza el número de niveles y ajusta los formularios dinámicamente
  updateLevels(numberOfLevels: number): void {
    const currentLength = this.levelDetails.length;
    //Agrega niveles
    if (numberOfLevels > currentLength) {
      for (let i = currentLength; i < numberOfLevels; i++) {
        this.levelDetails.push(this.createLevelFormGroup(i + 1));
        this.missions.push(this.fb.array([]));
      }
      //Elimina niveles
    } else if (numberOfLevels < currentLength) {
      for (let i = currentLength - 1; i >= numberOfLevels; i--) {
        this.levelDetails.removeAt(i);
        this.missions.removeAt(i);
      }
    }
  }

  //Crea un grupo de formulario para un nivel específico
  createLevelFormGroup(levelNumber: number): FormGroup {
    const levelNames = ["Principiante", "Intermedio", "Avanzado", "Experto", "Maestro"];
    const defaultName = levelNames[levelNumber - 1] || `Nivel ${levelNumber}`;
    return this.fb.group({
      name: [defaultName, Validators.required],
    });
  }


  //Maneja el cambio en el número de niveles desde la interfaz
  onLevelCountChange(event: any): void {
    const value = parseInt(event.target.value);
    this.updateLevels(value);
  }

  //Obtiene el array de misiones para un nivel específico
  getMissionsForLevel(levelIndex: number): FormArray {
    return this.missions.at(levelIndex) as FormArray;
  }

  //Agrega una nueva misión a un nivel específico
  addMission(levelIndex: number): void {
    const missionsArray = this.getMissionsForLevel(levelIndex);
    missionsArray.push(this.createMissionFormGroup());
  }

  //Elimina una misión de un nivel específico
  removeMission(levelIndex: number, missionIndex: number): void {
    const missionsArray = this.getMissionsForLevel(levelIndex);
    missionsArray.removeAt(missionIndex);
  }

  //Crea un grupo de formulario para una misión
  createMissionFormGroup(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.minLength(5)]],
      points: [10, [Validators.required, Validators.min(1)]],
      type: ['diaria', Validators.required],
      requirement: [1, [Validators.required, Validators.min(1)]]
    });
  }

  //Agrega un nuevo logro
  addAchievement(): void {
    this.achievements.push(this.createAchievementFormGroup());
  }

  //Elimina un logro por índice
  removeAchievement(index: number): void {
    this.achievements.removeAt(index);
  }

  //Crea un grupo de formulario para un logro
  createAchievementFormGroup(): FormGroup {
    return this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", [Validators.required, Validators.minLength(10)]],
      icon: ["trophy"],
    });
  }


  //Selecciona un color para el hábito
  selectColor(color: string): void {
    this.basicInfo.patchValue({ color });
  }

  //Maneja el envío del formulario para crear un nuevo hábito
  onSubmit(): void {
    //Verifica si el formulario es válido antes de enviar y evita envíos múltiples
    if (this.habitForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const habitData = this.prepareHabitData();
      //Envía los datos que ahora mismo no funciona porque no hay backend
      this.habitService.createHabit(habitData).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;

          if (response.success) {
            this.router.navigate(['/dashboard']);
          } else {
            alert('Error al crear hábito: ' + (response.message || 'Error desconocido'));
          }
        },
        error: (error: any) => {
          console.error(' Error al crear hábito:', error);
          this.isSubmitting = false;
        }
      });
      //Estos alerts son provisionales hasta implementar un mejor sistema de notificaciones
    } else if (this.isSubmitting) {
      alert('Ya se está enviando el hábito, por favor espera...');
    } else {
      alert('Por favor completa todos los campos obligatorios');
    }
  }

  //Prepara los datos del hábito para el envío al backend
  prepareHabitData(): any {
    const formValue = this.habitForm.value;
    const typeMap: any = { "diaria": "daily", "semanal": "weekly", "unica": "unique" };

    return {
      name: formValue.basicInfo.name,
      description: formValue.basicInfo.description,
      category: formValue.basicInfo.category,
      color: formValue.basicInfo.color,
      isPublic: formValue.basicInfo.isPublic,
      levels: formValue.levels.levelDetails.map((level: any, index: number) => ({
        name: level.name,
        missions: this.getMissionsForLevel(index).value.map((m: any) => ({
          description: m.description,
          points: m.points,
          type: typeMap[m.type] || m.type,
          requirement: m.requirement,
        }))
      })),
      achievements: formValue.achievements.map((a: any) => ({
        name: a.name,
        description: a.description,
        icon: a.icon,
      }))
    };
  }

  cancelCreation(): void {
    this.router.navigate(['/dashboard']);
  }
}