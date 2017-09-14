import { SipsService } from '../services/legacy/sips.service';
import * as moment from 'moment';

export function cacheDarTurno(unPaciente, unaAgenda, unTurno) {
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
        organizacion: unaAgenda.organizacion, // Objeto Organización
        tipoPrestacion: unTurno.tipoPrestacion, // Objeto tipo de prestación donde ya se que son las turneables y de aquí sale la especialiad para SIPS
        profesionales: unaAgenda.profesionales, // Los profesionales correspondiente a esta agenda (puede ser más de uno)
        horaInicio: unTurno.horaInicio,        
    };
    let dtoAgendaCache = {
        paciente: paciente,
        agenda: agenda,
        turno: turno
    };
    return dtoAgendaCache;
}
export function cacheAgendaOperations(unaAgenda) {
    // TODO: Deshabilitar agenda Sips entre otros
};
