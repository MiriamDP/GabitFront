import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Mission } from '../../../interfaces/habit/habit.interface';

@Component({
  selector: 'app-mission-card',
  templateUrl: './mission-card.component.html',
  styleUrls: ['./mission-card.component.css']
})
export class MissionCardComponent {
  @Input() mission!: Mission;
  @Output() missionComplete = new EventEmitter<number>();

  get isCompleted(): boolean {
    return this.mission.completed ?? false;
  }

  get missionTypeLabel(): string {
    const type = this.mission.type || 'unique';
    
    const labels: Record<string, string> = {
      'daily': 'Diaria',
      'weekly': 'Semanal',
      'unique': 'Única'
    };
    return labels[type] || 'Misión';
  }

  get missionTypeIcon(): string {
    const type = this.mission.type || 'unique';

    const icons: Record<string, string> = {
      'daily': 'Sun',
      'weekly': 'Calendar',
      'unique': 'Target'
    };
    return icons[type] || 'CheckSquare';
  }

  onCompleteMission(): void {
    if (!this.isCompleted) {
      this.missionComplete.emit(this.mission.idMission);
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  }
}