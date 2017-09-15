import {
    OrganizacionService
} from '../services/organizacion.service';
import { SipsService } from './../services/legacy/sips.service';
import * as moment from 'moment';

export class OperacionesSips {
    constructor(
        public serviceOrganizacion: OrganizacionService,
        public serviceLegacySips: SipsService
    ) {}

    cacheDarTurno(unPaciente, unaAgenda, unTurno) {

        this.serviceOrganizacion.getById(unaAgenda.organizacion.id).subscribe(unaOrganizacion => {
            let pacienteTurno = {
                id: unPaciente.id,
                documento: unPaciente.documento,
                apellido: unPaciente.apellido,
                nombre: unPaciente.nombre,
                sexo: unPaciente.sexo,
                fechaNacimiento: unPaciente.fechaNacimiento
            };
            let agenda = {
                organizacion: unaOrganizacion,
                profesionales: unaAgenda.profesionales,
                tipoPrestaciones: unaAgenda.tipoPrestaciones,
                espacioFisico: unaAgenda.espacioFisico,
                estado: unaAgenda.estado,
                horaInicio: unaAgenda.horaInicio,
                horaFin: unaAgenda.horaFin
            };
            let turno = {
                idAgenda: unaAgenda.id,
                estado: unTurno.estado,
                horaInicio: unTurno.horaInicio,
                tipoTurno: unTurno.tipoTurno,
                paciente: pacienteTurno
            };

            // Genero el DTO de esta forma para facilitar el acceso
            let dtoAgendaCache = {
                agenda: agenda,
                turno: turno
            };
            debugger;
            this.serviceLegacySips.save(dtoAgendaCache).subscribe(rta => {
                return rta;
            });
            return unaOrganizacion;
        });
    }


    cacheAgendaOperations(unaAgenda) {
        // TODO: Deshabilitar agenda Sips entre otros
    };



}
