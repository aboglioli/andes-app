import { Plex } from '@andes/plex';
import { Component, OnInit, HostBinding, Output, EventEmitter, Input, ViewChildren, QueryList, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoPrestacionService } from '../../services/tipoPrestacion.service';
let shiroTrie = require('shiro-trie');

@Component({
    selector: 'arbolPermisos',
    templateUrl: 'arbolPermisos.html'
})

export class ArbolPermisosComponent implements OnInit, OnChanges {

    private shiro = shiroTrie.new();
    private state = false;
    private all = false;
    private seleccionados = [];

    @Input() item: any;

    @Input() parentPermission: String = '';
    @Input() userPermissions: String[] = [];

    @ViewChildren(ArbolPermisosComponent) childsComponents: QueryList<ArbolPermisosComponent>;

    constructor(
        private plex: Plex,
        private servicioTipoPrestacion: TipoPrestacionService
    ) { }

    public ngOnInit() {
        this.initShiro();
        if (this.item.type) {
            if (this.item.type === 'boolean') {
                this.state = this.shiro.check(this.makePermission() + ':?');
            } else {
                let permisos = this.makePermission();
                let items: String[] = this.shiro.permissions(permisos + ':?');
                if (items.length > 0) {
                    if (items.indexOf('*') >= 0) {
                        this.all = true;
                    } else {

                        // [TODO] Buscar según el tipo
                        switch (this.item.type) {
                            case 'prestacion':
                                this.servicioTipoPrestacion.get({ id: items }).subscribe((data) => {
                                    this.seleccionados = data;
                                });
                                break;
                        }
                    }
                }
            }
        }
    }

    public ngOnChanges() {
        this.initShiro();
        if (this.item.type && this.item.type === 'boolean') {
            this.state = this.shiro.check(this.makePermission() + ':?');
        }
    }

    selectChange() {
        // console.log(this.seleccionados);
    }

    loadData(type, event) {
        // [TODO] Agregar parametros de busqueda en el JSON de permisos. Ej: { turneable: 1 }
        if (event.query) {
            // [TODO] Filtrar otras tipos de datos
            switch (type) {
                case 'prestacion':
                    let query = {
                        term: event.query
                    };
                    this.servicioTipoPrestacion.get(query).subscribe((data) => {
                        data = [...data, ...this.seleccionados];
                        event.callback(data);
                    });
                    break;
            }
        } else {
            event.callback(this.seleccionados || []);
        }
    }



    private initShiro() {
        this.shiro.reset();
        this.shiro.add(this.userPermissions);
    }

    private makePermission() {
        return this.parentPermission + (this.parentPermission.length ? ':' : '') + this.item.key;
    }

    public generateString(): String[] {
        let results = [];
        if (this.item.child) {
            this.childsComponents.forEach(child => {
                results = [...results, ...child.generateString()];
            });
            return results;
        } else {
            if (this.item.type === 'boolean') {
                if (this.state) {
                    return [this.makePermission()];
                }
            } else {
                if (this.all) {
                    return [this.makePermission() + ':*'];
                }

                let lists = [];
                this.seleccionados.forEach(item => {
                    lists.push(this.makePermission() + ':' + item._id);
                });
                return lists;
            }
        }
        return [];
    }

}
