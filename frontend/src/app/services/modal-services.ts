import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Type } from "@angular/core";
import { Injectable } from "@angular/core";
import { IModalWithModel } from "../shared/ModalWithModel";

@Injectable({
  providedIn: 'root'
})
export class ModalPersonalizadoService {

  constructor(private modalService: NgbModal) { }

  openModal<TModal extends IModalWithModel<TModelModal>, TModelModal>(
    component: Type<TModal>,
    data: TModelModal,
    options?: NgbModalOptions
  ): NgbModalRef {
    const modalRef = this.modalService.open(
      component,
      options ?? { centered: true });
      
    const instance = modalRef.componentInstance as IModalWithModel<TModelModal>;
    
    instance.model = data; 

    return modalRef;
  }
}