import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { HabitService, Category } from '../../services/habit.service';

@Component({
  selector: 'app-habit-creation',
  templateUrl: './habit-creation.component.html',
  styleUrls: ['./habit-creation.component.scss'],
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
    this.loadCategories();
    this.initForm();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.habitService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar categorías:', error);
        this.isLoading = false;
        // Categorías por defecto en caso de error
        this.categories = [
          { id: 1, nombre: 'Salud', icono: '🏃', descripcion: '', color: '', orden: 1, activa: true },
          { id: 2, nombre: 'Deporte', icono: '💪', descripcion: '', color: '', orden: 2, activa: true },
          { id: 3, nombre: 'Productividad', icono: '📊', descripcion: '', color: '', orden: 3, activa: true },
          { id: 4, nombre: 'Lectura', icono: '📚', descripcion: '', color: '', orden: 4, activa: true },
          { id: 5, nombre: 'Creatividad', icono: '🎨', descripcion: '', color: '', orden: 5, activa: true },
          { id: 6, nombre: 'Mindfulness', icono: '🧘', descripcion: '', color: '', orden: 6, activa: true },
          { id: 7, nombre: 'Social', icono: '👥', descripcion: '', color: '', orden: 7, activa: true },
          { id: 8, nombre: 'Otro', icono: '⭐', descripcion: '', color: '', orden: 8, activa: true }
        ];
      }
    });
  }

  initForm(): void {
    this.habitForm = this.fb.group({
      basicInfo: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', [Validators.required, Validators.minLength(10)]],
        category: ['', Validators.required],
        color: ['#3B82F6', Validators.required],
        isPublic: [false]
      }),
      levels: this.fb.group({
        numberOfLevels: [3, [Validators.required, Validators.min(1), Validators.max(10)]],
        levelDetails: this.fb.array([])
      }),
      missions: this.fb.array([]),
      achievements: this.fb.array([])
    });
    this.updateLevels(3);
  }

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

  nextStep(): void {
    if (this.currentStep < this.totalSteps && this.isCurrentStepValid()) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

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

  updateLevels(numberOfLevels: number): void {
    const currentLength = this.levelDetails.length;
    if (numberOfLevels > currentLength) {
      for (let i = currentLength; i < numberOfLevels; i++) {
        this.levelDetails.push(this.createLevelFormGroup(i + 1));
        this.missions.push(this.fb.array([]));
      }
    } else if (numberOfLevels < currentLength) {
      for (let i = currentLength - 1; i >= numberOfLevels; i--) {
        this.levelDetails.removeAt(i);
        this.missions.removeAt(i);
      }
    }
  }

  createLevelFormGroup(levelNumber: number): FormGroup {
    const levelNames = ['Principiante', 'Intermedio', 'Avanzado', 'Experto', 'Maestro'];
    const defaultName = levelNames[levelNumber - 1] || `Nivel ${levelNumber}`;
    return this.fb.group({
      name: [defaultName, Validators.required],
      pointsRequired: [levelNumber * 100, [Validators.required, Validators.min(1)]]
    });
  }

  onLevelCountChange(event: any): void {
    const value = parseInt(event.target.value);
    this.updateLevels(value);
  }

  getMissionsForLevel(levelIndex: number): FormArray {
    return this.missions.at(levelIndex) as FormArray;
  }

  addMission(levelIndex: number): void {
    const missionsArray = this.getMissionsForLevel(levelIndex);
    missionsArray.push(this.createMissionFormGroup());
  }

  removeMission(levelIndex: number, missionIndex: number): void {
    const missionsArray = this.getMissionsForLevel(levelIndex);
    missionsArray.removeAt(missionIndex);
  }

  createMissionFormGroup(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.minLength(5)]],
      points: [10, [Validators.required, Validators.min(1)]],
      type: ['diaria', Validators.required],
      requirement: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addAchievement(): void {
    this.achievements.push(this.createAchievementFormGroup());
  }

  removeAchievement(index: number): void {
    this.achievements.removeAt(index);
  }

  createAchievementFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      icon: ['🏆'],
      pointsReward: [50, [Validators.required, Validators.min(1)]],
      requirement: ['', Validators.required]
    });
  }

  selectColor(color: string): void {
    this.basicInfo.patchValue({ color });
  }

  onSubmit(): void {
    if (this.habitForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const habitData = this.prepareHabitData();
      
      console.log('📤 Enviando hábito a la API:', habitData);
      
      this.habitService.createHabit(habitData).subscribe({
        next: (response) => {
          console.log('✅ Respuesta del servidor:', response);
          this.isSubmitting = false;
          
          if (response.success) {
            alert(`¡Éxito! Hábito "${habitData.name}" creado correctamente.\n\nID: ${response.data.id}`);
            
            // Redirigir al dashboard
            this.router.navigate(['/dashboard']);
          } else {
            alert('Error: ' + (response.message || 'No se pudo crear el hábito'));
          }
        },
        error: (error) => {
          console.error('❌ Error al crear hábito:', error);
          this.isSubmitting = false;
          
          const errorMessage = error.error?.message || error.message || 'Error de conexión con el servidor';
          alert(`Error al crear el hábito:\n\n${errorMessage}\n\n¿Está el servidor Node.js corriendo en http://localhost:3000?`);
        }
      });
    } else if (this.isSubmitting) {
      alert('Ya se está enviando el hábito, por favor espera...');
    } else {
      alert('Por favor completa todos los campos obligatorios');
    }
  }

  prepareHabitData(): any {
    const formValue = this.habitForm.value;
    return {
      ...formValue.basicInfo,
      levels: formValue.levels.levelDetails.map((level: any, index: number) => ({
        ...level,
        missions: this.getMissionsForLevel(index).value
      })),
      achievements: formValue.achievements
    };
  }

  cancelCreation(): void {
    if (confirm('¿Estás seguro de que quieres cancelar? Se perderán todos los cambios.')) {
      this.habitForm.reset();
      this.currentStep = 1;
    }
  }
}
