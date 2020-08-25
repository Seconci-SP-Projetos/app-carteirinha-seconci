
import { Injectable }  from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

@Injectable()
export class ValidaSMSDetailResolver {

    constructor(private router: Router,
                private route:  ActivatedRoute) {};

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

        let idBeneficiario  = localStorage.getItem('idBeneficiario');
        let smsCodigoValidado = localStorage.getItem('smsCodigoValidado');
        
        if (idBeneficiario != null) {
            if (smsCodigoValidado != null) {
                this.router.navigate(['./carteira'], { relativeTo: this.route });
            } 
        } else {
            this.router.navigate(['./login'], { relativeTo: this.route });
        }
    }
}
