import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: boolean = false;
  public notificarUpload = new EventEmitter<any>();

  constructor() { }


  abrirModal() {
    this.modal = true;
  }

  cerrarModal() {
    this.modal = false;
  }

}
