import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  constructor() {}
  // ...
  public isAuthenticated(): boolean {

    let idBeneficiario      = localStorage.getItem('idBeneficiario');
    // let smsCodigoValidado   = localStorage.getItem('smsCodigoValidado');
    let aceiteTermo   = localStorage.getItem('aceiteTermo');

    return (idBeneficiario != null && aceiteTermo != null);

  }
}