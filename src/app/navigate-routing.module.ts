
import { Injectable }  from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

@Injectable()
export class LoginDetailResolver {

    constructor(private router: Router,
                private route:  ActivatedRoute) {};

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

        let idBeneficiario  = localStorage.getItem('idBeneficiario');
        let aceiteTermo     = localStorage.getItem('aceiteTermo');
        // let smsValidateCode = localStorage.getItem('smsValidateCode');

        // if (idBeneficiario != null && smsValidateCode != null) {
        if (idBeneficiario != null && aceiteTermo != null) {
            this.router.navigate(['./carteira'], { relativeTo: this.route });
        }
    }
}