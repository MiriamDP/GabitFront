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

  onMissionProgress(event: { missionId: number, increment: number }): void {
    this.missionProgress.emit(event);
  }

  onMissionComplete(missionId: number): void {
    this.missionComplete.emit(missionId);
  }

  get hasMissions(): boolean {
    return this.missions && this.missions.length > 0;
  }

  get completedCount(): number {
    return this.missions.filter(m => m.completada).length;
  }

  get totalCount(): number {
    return this.missions.length;
  }
}