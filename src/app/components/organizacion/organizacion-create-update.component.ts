import { Plex } from '@andes/plex';
import { Server } from '@andes/shared';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit, Output, EventEmitter, Input, HostBinding } from '@angular/core';
import * as enumerados from './../../utils/enumerados';
// Services
import { BarrioService } from './../../services/barrio.service';
import { TipoEstablecimientoService } from './../../services/tipoEstablecimiento.service';
import { OrganizacionService } from './../../services/organizacion.service';
import { PaisService } from './../../services/pais.service';
import { ProvinciaService } from './../../services/provincia.service';
import { LocalidadService } from './../../services/localidad.service';
// Interfaces
import { IPais } from './../../interfaces/IPais';
import { IBarrio } from './../../interfaces/IBarrio';
import { ILocalidad } from './../../interfaces/ILocalidad';
import { IUbicacion } from './../../interfaces/IUbicacion';
import { IEdificio } from './../../interfaces/IEdificio';
import { IDireccion } from './../../interfaces/IDireccion';
import { IContacto } from './../../interfaces/IContacto';
import { IOrganizacion } from './../../interfaces/IOrganizacion';
import { ITipoEstablecimiento } from './../../interfaces/ITipoEstablecimiento';
import { IProvincia } from './../../interfaces/IProvincia';

@Component({
    selector: 'organizacion-create-update',
    templateUrl: 'organizacion-create-update.html'
})
export class OrganizacionCreateUpdateComponent implements OnInit {

    @HostBinding('class.plex-layout') layout = true;  // Permite el uso de flex-box en el componente
    @Input('seleccion') seleccion: IOrganizacion;
    @Output() data: EventEmitter<IOrganizacion> = new EventEmitter<IOrganizacion>();

    // definición de arreglos
    tiposEstablecimiento: ITipoEstablecimiento[];
    tipoComunicacion: any[];
    todasLocalidades: ILocalidad[];
    localidadesNeuquen: any[];

    private paisArgentina = null;
    private provinciaNeuquen = null;
    private barrioNulleado = null;

    tipoEstablecimiento: ITipoEstablecimiento = {
        nombre: '',
        descripcion: '',
        clasificacion: '',
        idTipoEfector: 0,
    };

    ubicacion: IUbicacion = {
        barrio: {
            id: '',
            nombre: ''
        },
        localidad: {
            id: '',
            nombre: ''
        },
        provincia: {
            id: '',
            nombre: ''
        },
        pais: {
            id: '',
            nombre: ''
        }
    };

    contacto: IContacto = {
        tipo: 'celular',
        valor: '',
        ranking: 0,
        activo: true,
        ultimaActualizacion: new Date()
    };

    direccion: IDireccion = {
        valor: '',
        codigoPostal: '',
        ubicacion: this.ubicacion,
        ranking: 0,
        geoReferencia: null,
        ultimaActualizacion: new Date(),
        activo: true
    };

    edificio: IEdificio = {
        id: null,
        descripcion: '',
        contacto: this.contacto,
        direccion: this.direccion,
    };

    organizacionModel: IOrganizacion = {
        id: null,
        codigo: {
            sisa: '',
            cuie: '',
            remediar: ''
        },
        nombre: '',
        tipoEstablecimiento: this.tipoEstablecimiento,
        direccion: this.direccion,
        contacto: [this.contacto],
        edificio: [this.edificio],
        nivelComplejidad: 0,
        activo: true,
        fechaAlta: new Date(),
        fechaBaja: new Date(),
    };

    constructor(
        private organizacionService: OrganizacionService,
        private paisService: PaisService,
        private provinciaService: ProvinciaService,
        private localidadService: LocalidadService,
        private BarrioService: BarrioService,
        private tipoEstablecimientoService: TipoEstablecimientoService,
        public plex: Plex, private server: Server
    ) { }

    ngOnInit() {
        this.tipoComunicacion = enumerados.getObjTipoComunicacion();
        this.tipoEstablecimientoService.get().subscribe(resultado => {
            this.tiposEstablecimiento = resultado;
        });

        if (this.seleccion && this.seleccion.id) {
            this.organizacionService.getById(this.seleccion.id).subscribe(resultado => {
                if (resultado) {
                    Object.assign(this.organizacionModel, resultado);
                }
            });
        }

        // Set País Argentina
        this.paisService.get({
            nombre: 'Argentina'
        }).subscribe(arg => {
            this.paisArgentina = arg[0];
        });
        // Set provincia Neuquen
        this.provinciaService.get({
            nombre: 'Neuquén'
        }).subscribe(Prov => {
            this.provinciaNeuquen = Prov[0];
            this.loadLocalidades(this.provinciaNeuquen);
        });

    }

    onSave(valid) {
        let organizacionGuardar = Object.assign({}, this.organizacionModel);
        organizacionGuardar.contacto.map(elem => {
            elem.tipo = ((typeof elem.tipo === 'string') ? elem.tipo : (Object(elem.tipo).id));
            return elem;
        });
        if (organizacionGuardar.edificio) {
            organizacionGuardar.edificio.forEach(e => {
                if (e.contacto) {
                    e.contacto.tipo = ((typeof e.contacto.tipo === 'string') ? e.contacto.tipo : (Object(e.contacto.tipo).id));
                }
                e.direccion.ubicacion.pais = this.paisArgentina;
                e.direccion.ubicacion.provincia = this.provinciaNeuquen;
                e.direccion.ubicacion.barrio = null;
            });
        }
        organizacionGuardar.direccion.ubicacion.pais = this.paisArgentina;
        organizacionGuardar.direccion.ubicacion.provincia = this.provinciaNeuquen;
        organizacionGuardar.direccion.ubicacion.barrio = null;

        let operacion = this.organizacionService.save(organizacionGuardar);
        operacion.subscribe(result => {
            if (result) {
                this.plex.alert('Los datos se actualizaron correctamente');
                this.data.emit(result);
            } else {
                this.plex.alert('ERROR: Ocurrio un problema al actualizar los datos');
            }
        });
    }

    onCancel() {
        window.setTimeout(() => this.data.emit(null), 100);
    }

    addContacto() {
        let nuevoContacto = Object.assign({}, {
            tipo: 'celular',
            valor: '',
            ranking: 0,
            activo: true,
            ultimaActualizacion: new Date()
        });
        this.organizacionModel.contacto.push(nuevoContacto);
    }

    removeContacto(i) {
        if (i >= 0) {
            this.organizacionModel.contacto.splice(i, 1);
        }
    }

    addEdificio() {
        let nuevoEdificio = Object.assign({}, {
            id: null,
            descripcion: '',
            contacto: {
                tipo: 'celular',
                valor: '',
                ranking: 0,
                activo: true,
                ultimaActualizacion: new Date()
            },
            direccion: {
                valor: '',
                codigoPostal: '',
                ubicacion: {
                    barrio: {
                        id: '',
                        nombre: ''
                    },
                    localidad: {
                        id: '',
                        nombre: ''
                    },
                    provincia: {
                        id: '',
                        nombre: ''
                    },
                    pais: {
                        id: '',
                        nombre: ''
                    }
                },
                ranking: 0,
                geoReferencia: null,
                ultimaActualizacion: new Date(),
                activo: true
            },
        });
        if (this.organizacionModel.edificio) {
            this.organizacionModel.edificio.push(nuevoEdificio);
        } else {
            this.organizacionModel.edificio = [nuevoEdificio];
        }
    }

    removeEdificio(i) {
        if (i >= 0) {
            this.organizacionModel.edificio.splice(i, 1);
        }
    }

    loadLocalidades(provincia) {
        if (provincia && provincia.id) {
            this.localidadService.get({
                'provincia': provincia.id
            }).subscribe(result => {
                this.localidadesNeuquen = [...result];
            });
        }
    }
}
