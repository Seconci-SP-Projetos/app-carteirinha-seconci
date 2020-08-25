import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  constructor() {}
  // ...
  public isAuthenticated(): boolean {

    let idBeneficiario      = localStorage.getItem('idBeneficiario');
    let smsCodigoValidado   = localStorage.getItem('smsCodigoValidado');

    return (idBeneficiario != null && smsCodigoValidado != null);

  }
}