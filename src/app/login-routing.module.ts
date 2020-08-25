
import { Injectable }  from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

@Injectable()
export class LoginDetailResolver {

    constructor(private router: Router,
                private route:  ActivatedRoute) {};

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

        let idBeneficiario      = localStorage.getItem('idBeneficiario');
        let smsCodigoValidado   = localStorage.getItem('smsCodigoValidado');

        if (idBeneficiario != null && smsCodigoValidado != null) {
            this.router.navigate(['./carteira'], { relativeTo: this.route });
        }
    }
}