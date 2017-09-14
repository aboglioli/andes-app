import {
    OrganizacionService
} from '../services/organizacion.service';
import { SipsService } from './../services/legacy/sips.service';
import * as moment from 'moment';

export class OperacionesSips {
    constructor(
        public serviceOrganizacion: OrganizacionService,
        public serviceLegacySips: SipsService
    ) {
    }

    cacheDarTurno(unPaciente, unaAgenda, unTurno) {

        this.serviceOrganizacion.getById(unaAgenda.organizacion.id).subscribe(unaOrganizacion => {
            let paciente = {
                id: unPaciente.id,
                documento: unPaciente.documento,
                apellido: unPaciente.apellido,
                nombre: unPaciente.nombre,
                sexo: unPaciente.sexo,
                fechaNacimiento: unPaciente.fechaNacimiento
            };
            let agenda = {
                estado: unaAgenda.estado, // Estado gral de la agenda
                bloque: unaAgenda.bloques,
            };
            let turno = {
                organizacion: unaOrganizacion, // Objeto Organización armado usando el servicio
                tipoPrestacion: unTurno.tipoPrestacion, // Objeto tipo de prestación donde ya se que son las turneables y de aquí sale la especialiad para SIPS
                profesionales: unaAgenda.profesionales, // Los profesionales correspondiente a esta agenda (puede ser más de uno)
                horaInicio: unTurno.horaInicio,
            };
            let dtoAgendaCache = {
                paciente: paciente,
                agenda: agenda,
                turno: turno
            };
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
