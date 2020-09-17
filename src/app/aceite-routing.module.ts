
import { Injectable }  from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

@Injectable()
export class AceiteDetailResolver {

    constructor(private router: Router,
                private route:  ActivatedRoute) {};

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

        let termoAceite  = localStorage.getItem('aceiteTermo');

        if (termoAceite != null) {
            this.router.navigate(['./login'], { relativeTo: this.route });
        } 
    }
}