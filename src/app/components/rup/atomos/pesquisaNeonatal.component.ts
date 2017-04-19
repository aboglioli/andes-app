import { Atomo } from './atomoComponent';
import { IPaciente } from '../../../interfaces/IPaciente';
import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
@Component({
  selector: 'rup-PesquisaNeonatal',
  templateUrl: 'pesquisaNeonatal.html'
})
export class PesquisaNeonatalComponent extends Atomo {
  getMensajes() {
    let mensaje: any = {
      texto: null,
      class: 'danger'
    };
    if (this.data[this.tipoPrestacion.key] == false) {
      mensaje.texto = 'Alarma'; //Ver el texto.
    }
    return mensaje;
  }
}