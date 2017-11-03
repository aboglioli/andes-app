import { Component, OnInit, HostBinding, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ObjectID } from 'bson';
import { Plex } from '@andes/plex';
import { Auth } from '@andes/auth';
import { IPrestacion } from '../../interfaces/prestacion.interface';
import { PacienteService } from './../../../../services/paciente.service';
import { ElementosRUPService } from './../../services/elementosRUP.service';
import { IPaciente } from './../../../../interfaces/IPaciente';

@Component({
    selector: 'rup-vistaHuds',
    templateUrl: 'vistaHuds.html',
    encapsulation: ViewEncapsulation.None
})
export class VistaHudsComponent implements OnInit {

    @HostBinding('class.plex-layout') layout = true;


    public paciente: IPaciente;

    // Defaults de Tabs panel derecho
    public panelIndex = 0;

    // Array de registros de la HUDS a agregar en tabs
    public registrosHuds: any[] = [];

    constructor(public elementosRUPService: ElementosRUPService,
        public plex: Plex, public auth: Auth,
        private router: Router, private route: ActivatedRoute,
        private servicioPaciente: PacienteService) { }

     /**
     *Inicializamos con el id del paciente
     * Cargamos los problemas del paciente
     *
     */
    ngOnInit() {
        this.route.params.subscribe(params => {
            let id = params['id'];
            // Carga la información completa del paciente
            this.servicioPaciente.getById(
                id).subscribe(paciente => {
                this.paciente = paciente;
            });
        });
    }

    agregarListadoHuds(registrosHuds) {
        this.registrosHuds = registrosHuds;
    }
    volver() {
        this.router.navigate(['rup']);
    }

}