import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Achievement } from '../../../interfaces/habit/habit.interface';

@Component({
  selector: 'app-achievement-modal',
  templateUrl: './achievement-modal.component.html',
  styleUrls: ['./achievement-modal.component.css']
})
export class AchievementModalComponent {
  @Input() achievements: Achievement[] = [];
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}