import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Plex } from '@andes/plex';
import { Observable } from 'rxjs/Rx';
import { Auth } from '@andes/auth';

@Component({
    templateUrl: 'login.html',
    styleUrls: ['login.scss'],
    encapsulation: ViewEncapsulation.None // Use to disable CSS Encapsulation for this component
})
export class LoginComponent implements OnInit {
    public usuario: number;
    public password: string;
    public organizacion: any;

    constructor(private plex: Plex, private auth: Auth, private router: Router) { }

    ngOnInit() {
        this.auth.logout();
    }

    login(event) {
        if (event.formValid) {
            this.auth.login(this.usuario.toString(), this.password, this.organizacion.id)
                .subscribe((data) => {
                    this.plex.updateUserInfo({ usuario: this.auth.usuario, organizacion: this.auth.organizacion });
                    this.router.navigate(['inicio']);
                }, (err) => {
                    this.plex.info('danger', 'Usuario o contraseña incorrectos');
                });
        }
    }

    loadOrganizaciones(event) {
        this.auth.organizaciones().subscribe(event.callback);
    }
}
