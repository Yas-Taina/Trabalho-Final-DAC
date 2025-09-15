import { Component, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() title: string = '';
  // Outras configs são possíveis

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  closeModal() {
    this.activeModal.close(true);
  }
}