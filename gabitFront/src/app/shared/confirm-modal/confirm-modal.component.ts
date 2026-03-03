import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {
  @Input() title: string = '¿Estás seguro?';
  @Input() message: string = 'Esta acción no se puede deshacer.';
  @Input() confirmText: string = 'Eliminar';
  @Input() cancelText: string = 'Cancelar';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}