import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Mission } from '../../../interfaces/habit/habit.interface';

@Component({
  selector: 'app-mission-list',
  templateUrl: './mission-list.component.html',
  styleUrls: ['./mission-list.component.css']
})
export class MissionListComponent {
  @Input() missions: Mission[] = [];
  @Input() habitColor: string = '#05576B';
  
  @Output() missionProgress = new EventEmitter<{ missionId: number, increment: number }>();
  @Output() missionComplete = new EventEmitter<number>();

  // --- GETTERS QUE PIDE TU HTML ---

  // 1. Para {{ completedCount }}
  get completedCount(): number {
    if (!this.missions) return 0;
    // Usamos 'completed' (inglés) y seguridad (?? false)
    return this.missions.filter(m => m.completed ?? false).length;
  }

  // 2. Para {{ totalCount }}
  get totalCount(): number {
    return this.missions?.length || 0;
  }

  // 3. Para *ngIf="hasMissions"
  get hasMissions(): boolean {
    return this.missions && this.missions.length > 0;
  }

  // --- MÉTODOS DE ACCIÓN ---

  onMissionProgress(event: { missionId: number, increment: number }): void {
    this.missionProgress.emit(event);
  }

  onMissionComplete(missionId: number): void {
    this.missionComplete.emit(missionId);
  }

  // Opcional: Para optimizar el *ngFor
  trackByMissionId(index: number, mission: Mission): number {
    return mission.idMission;
  }
}