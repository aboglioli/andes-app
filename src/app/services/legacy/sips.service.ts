import {
    Observable
} from 'rxjs/Rx';
import {
    Injectable
} from '@angular/core';
import {
    Server
} from '@andes/shared';
import {
    environment
} from '../../../environments/environment';

@Injectable()
export class SipsService {
    private legacyUrl = '/modules/legacy'; // URL to web api

    constructor(private server: Server) {}

    save(cacheData: any): Observable < any > {
        if (cacheData) {
            return this.server.post(this.legacyUrl + '/sips', { params: cacheData, showError: true });
        }
    }
};
