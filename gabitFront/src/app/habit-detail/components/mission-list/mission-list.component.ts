import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'; 
import { Mission } from '../../../interfaces/habit/habit.interface';

@Component({
  selector: 'app-mission-list',
  templateUrl: './mission-list.component.html',
  styleUrls: ['./mission-list.component.css']
})
export class MissionListComponent implements OnChanges { 
  @Input() missions: Mission[] = [];
  @Output() missionComplete = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['missions']) {
      console.log('Misiones actualizadas:', this.missions);
    }
  }

  get completedCount(): number {
    if (!this.missions) return 0;
    return this.missions.filter(m => m.completed ?? false).length;
  }

  get totalCount(): number {
    return this.missions?.length || 0;
  }

  get hasMissions(): boolean {
    return this.missions && this.missions.length > 0;
  }

  onMissionComplete(missionId: number): void {
    this.missionComplete.emit(missionId);
  }

  trackByMissionId(index: number, mission: Mission): number {
    return mission.idMission;
  }
}