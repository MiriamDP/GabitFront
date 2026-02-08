import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-level-up-modal',
  templateUrl: './level-up-modal.component.html',
  styleUrls: ['./level-up-modal.component.css']
})
export class LevelUpModalComponent {
  @Input() newLevel: number = 0;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}