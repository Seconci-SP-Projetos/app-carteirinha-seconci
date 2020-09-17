
import { Injectable }  from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

@Injectable()
export class LoginDetailResolver {

    constructor(private router: Router,
                private route:  ActivatedRoute) {};

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

        let idBeneficiario      = localStorage.getItem('idBeneficiario');
        // let smsCodigoValidado   = localStorage.getItem('smsCodigoValidado');
        let termoAceite         = localStorage.getItem('aceiteTermo');
        
        // if (idBeneficiario != null && smsCodigoValidado != null) {
        if (idBeneficiario != null && termoAceite != null) {
            this.router.navigate(['./agenda'], { relativeTo: this.route });
        }
    }
}