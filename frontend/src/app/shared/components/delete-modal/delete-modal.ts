import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './delete-modal.html',
  styleUrl: './delete-modal.css',
})
export class DeleteModal {
  @Input() title = 'Delete item?';
  @Input() description = 'This action cannot be undone.';
  @Input() confirmLabel = 'Delete';
  @Input() cancelLabel = 'Cancel';
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
}
