import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Mission } from '../../../interfaces/habit/habit.interface'; // Ajusta la ruta si es necesario

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
    return this.mission.completed ?? false;
  }

  get progress(): number {
    const requirement = this.mission.requirement || 1; // Evitar división por 0
    const current = this.mission.current_progress || 0;
    
    return Math.min((current / requirement) * 100, 100);
  }

  get progressText(): string {
    const requirement = this.mission.requirement || 0;
    const current = this.mission.current_progress || 0;
    return `${current} / ${requirement}`;
  }

  get missionTypeLabel(): string {
    // Valor por defecto si type es undefined
    const type = this.mission.type || 'unique';
    
    const labels: Record<string, string> = {
      'daily': 'Diaria',
      'weekly': 'Semanal',
      'unique': 'Única'
    };
    return labels[type] || 'Misión';
  }

  get missionTypeIcon(): string {
    // Valor por defecto si type es undefined
    const type = this.mission.type || 'unique';

    const icons: Record<string, string> = {
      'daily': 'Sun',
      'weekly': 'Calendar',
      'unique': 'Star'
    };
    return icons[type] || 'Star';
  }

  get canComplete(): boolean {
    const requirement = this.mission.requirement || 0;
    const current = this.mission.current_progress || 0;

    // Solo se puede completar si hay un requisito definido (> 0) y se alcanzó
    return requirement > 0 && current >= requirement && !this.isCompleted;
  }

  onIncrementProgress(): void {
    if (!this.isCompleted) {
      this.missionProgress.emit({ 
        missionId: this.mission.idMission, 
        increment: 1 
      });
    }
  }

  onCompleteMission(): void {
    if (this.canComplete) {
      this.missionComplete.emit(this.mission.idMission);
    }
  }
}