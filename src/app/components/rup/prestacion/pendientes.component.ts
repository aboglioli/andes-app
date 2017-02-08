import { ITipoPrestacion } from './../../../interfaces/ITipoPrestacion';
import { PrestacionPacienteService } from './../../../services/rup/prestacionPaciente.service';
import { IPrestacionPaciente } from './../../../interfaces/rup/IPrestacionPaciente';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProblemaPacienteService } from './../../../services/rup/problemaPaciente.service';

import { IPaciente } from './../../../interfaces/IPaciente';
import { IProblemaPaciente } from './../../../interfaces/rup/IProblemaPaciente';

@Component({
    selector: 'rup-prestacionesPendientes',
    templateUrl: 'pendientes.html'
})
export class PrestacionesPendientesComponent implements OnInit {

    //@Input() profesional: any;

    //@Input() tipoPrestacione: any;
    tipoPrestacion: ITipoPrestacion; // será un IPaciente


    // resultados a devolver
    data: Object = {};
    listaPrestaciones: IPrestacionPaciente[] = [];
    prestacionSeleccionada: IPrestacionPaciente = null; // será un IPaciente

    showPendientes = true;
    showDashboard = false;

    enEjecucion = false;

    constructor(private servicioPrestacion: PrestacionPacienteService, 
        private servicioProblemasPaciente: ProblemaPacienteService,
        private router: Router) {

    }


    ngOnInit() {
        // debugger;

        this.tipoPrestacion = {
            id: "5894657e7358af394f6d52e2",
            key: "consultaGeneralClinicaMedica",
            nombre: "Consulta general de clínica médica",
            descripcion: "Consulta general de clínica médica",
            codigo: null,
            autonoma: true,
            solicitud: null,
            ejecucion: null,
            activo: true,
            componente: ""
        }

        this.loadPrestaciones();

    }

    loadPrestaciones() {
        this.servicioPrestacion.get({ estado: 'pendiente', idTipoPrestacion: this.tipoPrestacion.id }).subscribe(resultado => {
            this.listaPrestaciones = resultado;
        });
    }

    elegirPrestacion(prestacion: IPrestacionPaciente) {
        this.prestacionSeleccionada = prestacion;
        this.showPendientes = false;

        this.showDashboard = true;
    }

}