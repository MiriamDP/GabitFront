import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HabitDetail } from 'src/app/interfaces/habit/habit.interface';

@Component({
  selector: 'app-habit-header',
  templateUrl: './habit-header.component.html',
  styleUrls: ['./habit-header.component.css']
})
export class HabitHeaderComponent {
  @Input() habitDetail: HabitDetail | null = null;
  @Output() back = new EventEmitter<void>();

  goBack(): void {
    this.back.emit();
  }

  get categoryColor(): string {
    return this.habitDetail?.category?.color || this.habitDetail?.color || '#05576B';
  }

  get habitIcon(): string {
    return this.habitDetail?.category?.icon || 'Star';
  }
}