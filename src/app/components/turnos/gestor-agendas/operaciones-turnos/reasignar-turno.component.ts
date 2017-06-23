import { CalendarioComponent } from './../../dar-turnos/calendario.component';
import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';
import { Auth } from '@andes/auth';
import { IAgenda } from './../../../../interfaces/turnos/IAgenda';
import { ITurno } from './../../../../interfaces/turnos/ITurno';
import { AgendaService } from '../../../../services/turnos/agenda.service';
import { TurnoService } from '../../../../services/turnos/turno.service';
// import { SmsService } from './../../../../services/turnos/sms.service';
import * as moment from 'moment';

@Component({
    selector: 'reasignar-turno',
    templateUrl: 'reasignar-turno.html'
})

export class ReasignarTurnoComponent implements OnInit {


    @Input() agendaAReasignar: IAgenda;

    @Output() saveSuspenderTurno = new EventEmitter<IAgenda>();
    @Output() reasignarTurnoSuspendido = new EventEmitter<boolean>();
    @Output() cancelaSuspenderTurno = new EventEmitter<boolean>();

    public turnoAReasignar: ITurno;

    agendasCandidatas: any[] = [];
    public motivoSuspension: any[];
    public motivoSuspensionSelect = { select: null };
    public seleccionadosSMS = [];
    public suspendio = false;
    autorizado: any;

    constructor(public plex: Plex, public auth: Auth, public serviceAgenda: AgendaService, public serviceTurno: TurnoService) { }

    ngOnInit() {
        this.autorizado = this.auth.getPermissions('turnos:darTurnos:?').length > 0;
        // this.turnoAReasignar = this.agendaAReasignar;
        this.agendaAReasignar.bloques.forEach(bloque => {
            bloque.turnos.forEach(turno => {
                if (turno.paciente) {
                    let params = {
                        idAgenda: this.agendaAReasignar.id,
                        idBloque: bloque.id,
                        idTurno: turno.id
                    };


                    this.serviceTurno.get(params).subscribe((agendas) => {
                        this.agendasCandidatas = [... this.agendasCandidatas, { turno: turno, agendas: agendas, similitud: this.calculosSimilitud(turno, agendas) }];



                        console.log('agendasCandidatas', this.agendasCandidatas);
                    });
                }

            });
        });
    }

    calculosSimilitud(turno: ITurno, agendas: IAgenda[]): Number {

        let calculos = 0;
        agendas.forEach((ag) => {
            ag.bloques.forEach((bl) => {
                bl.turnos.forEach((tu) => {
                    let calculoSimilitud = {
                        tipoPrestacion: (turno.tipoPrestacion.nombre === ag.tipoPrestaciones[0].nombre ? 30 : 0),
                        horaInicio: (turno.horaInicio === tu.horaInicio ? 30 : 0),
                        duracionTurno: (this.agendaAReasignar.bloques.find(x => x.duracionTurno === bl.duracionTurno) ? 20 : 0),
                        profesional: (ag.profesionales.length && ag.profesionales[0].nombre ? 10 : 0),
                        diaSemana: (moment(tu.horaInicio).weekday() === moment(ag.horaInicio).weekday() ? 10 : 0)
                    };
                    console.log(calculoSimilitud.tipoPrestacion + calculoSimilitud.horaInicio + calculoSimilitud.duracionTurno + calculoSimilitud.profesional + calculoSimilitud.diaSemana);

                    calculos = (calculoSimilitud.tipoPrestacion + calculoSimilitud.horaInicio + calculoSimilitud.duracionTurno + calculoSimilitud.profesional + calculoSimilitud.diaSemana);
                });
            });
        });

        if (calculos > 0) {
            return calculos;
        }


    }

    cargarAgendasCandidatas(idAgendaAReasignar, idBloque, idTurno) {

        let params = {
            idAgenda: idAgendaAReasignar,
            idBloque: idBloque,
            idTurno: idTurno
        };

        console.log('agendasCandidatas', this.agendasCandidatas);


        this.serviceTurno.get(params).subscribe((agendas) => {

            let indice = this.agendasCandidatas.find(x => x.idTurno === idTurno);
            // if (indice === -1) {
            let candidatas = {
                idTurno: idTurno,
                agendas: agendas
            };
            this.agendasCandidatas = [... this.agendasCandidatas, candidatas];
            // }
            console.log('agendasCandidatas', this.agendasCandidatas);
        });
    }

    seleccionarTurno(turno) {
        let indice = this.seleccionadosSMS.indexOf(turno);
        if (indice === -1) {
            if (turno.paciente) {
                this.seleccionadosSMS = [...this.seleccionadosSMS, turno];
            }
        } else {
            this.seleccionadosSMS.splice(indice, 1);
            this.seleccionadosSMS = [...this.seleccionadosSMS];
        }
    }

    estaSeleccionado(turno) {
        // console.log('turno.paciente ', turno.paciente);
        if (this.seleccionadosSMS.indexOf(turno) >= 0) {
            return true;
        } else {
            return false;
        }
    }


    reasignarTurno(paciente: any) {
        // this.reasignarTurnoSuspendido.emit(this.turnoAReasignar);
    }

    enviarSMS(turno: any, mensaje) {

    }

    smsEnviado(turno) {

    }

    cancelar() {
        this.cancelaSuspenderTurno.emit(true);
        this.turnoAReasignar = null;
    }

    cerrar() {
        // this.saveSuspenderTurno.emit(this.agenda);
    }

}
