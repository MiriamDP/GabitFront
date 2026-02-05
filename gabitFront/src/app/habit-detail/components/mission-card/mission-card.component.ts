import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Mission } from '../../../interfaces/habit/habit.interface';

@Component({
  selector: 'app-mission-card',
  templateUrl: './mission-card.component.html',
  styleUrls: ['./mission-card.component.css']
})
export class MissionCardComponent {
  @Input() mission!: Mission;
  @Input() habitColor: string = '#05576B';
  @Output() missionProgress = new EventEmitter<{ missionId: number, increment: number }>();
  @Output() missionComplete = new EventEmitter<number>();

  get isCompleted(): boolean {
    return this.mission.completada;
  }

  get progress(): number {
    if (this.mission.requisito === 0) return 0;
    return Math.min((this.mission.progreso_actual / this.mission.requisito) * 100, 100);
  }

  get progressText(): string {
    return `${this.mission.progreso_actual} / ${this.mission.requisito}`;
  }

  get missionTypeLabel(): string {
    const labels = {
      'diaria': 'Diaria',
      'semanal': 'Semanal',
      'unica': 'Única'
    };
    return labels[this.mission.tipo];
  }

  get missionTypeIcon(): string {
    const icons = {
      'diaria': '☀️',
      'semanal': '📅',
      'unica': '⭐'
    };
    return icons[this.mission.tipo];
  }

  get canComplete(): boolean {
    return this.mission.progreso_actual >= this.mission.requisito && !this.isCompleted;
  }

  onIncrementProgress(): void {
    if (!this.isCompleted) {
      this.missionProgress.emit({ 
        missionId: this.mission.id, 
        increment: 1 
      });
    }
  }

  onCompleteMission(): void {
    if (this.canComplete) {
      this.missionComplete.emit(this.mission.id);
    }
  }
}