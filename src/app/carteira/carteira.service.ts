import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


const httpOptions = {
 
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'id': 'auth0_5a4c332eca00bd289d0b27e5',
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJVUTNNell6TTBReU1qVkJORGRETnpZd1FURkRSVVZDT1VReU1qSTFPRE0yUTBWQlFUTkJOQSJ9.eyJuaWNrbmFtZSI6Im5hZGFsIiwibmFtZSI6IkVkc29uIFNhbnRhbmEgQW5kcmFkZSAiLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvZThkZmMzOWY5ZTFkOWQ3NmY4NDhhMGVmM2VmNjNjYzQ_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZlcy5wbmciLCJ1cGRhdGVkX2F0IjoiMjAxOS0wNy0wOVQwMjoyNDowOS45NzNaIiwiaXNzIjoiaHR0cHM6Ly91c2V3aXpseS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWE0YzMzMmVjYTAwYmQyODlkMGIyN2U1IiwiYXVkIjoidXpyY0VfTTEzSExoOW5NQUptT201anJ0NXBBVjZ2WU8iLCJpYXQiOjE1NjI2MzkwNTAsImV4cCI6MTU2MjY3NTA1MCwiYXRfaGFzaCI6IjFuRzNYU2wxVV9iY2xOaENmWEoyYnciLCJub25jZSI6ImsxUm51VkMtNWNDaTdJVTVtdWUzaWhPRmYuY0lUc1g2In0.D6djHMMRZOGjOx5zbf-CWYRZIBvCF0OE8vuLeqGIxvEpkANOf3bOhUDcdf4i2w8JRKy8qA_66LjiE-0v11mLVeYeHeHFZwBj9WvlDcFRY58gChwoJi4JYMFk3oZ-Qe6dkJ-tWVsUqs2brOEjN0mSuwqPLSlxisdKunIPhJhdXuxJP-Uqlseh2jw7GK0XY1WtDAXdnoqRAjf70H60q2BdYqz8t6JNr_hCpUbJDc1ppwijEnq0l7EYfj1KjTP_MePNwh4VZN-uoFao8M10EQ8Pd8BQgD3XSOFZpUBh45UnoLdL24NfZDUqqheB5D-93GnsHsLwD0IGmTiXr3t-NZQFWw'
  })

};

@Injectable({
  providedIn: 'root'
})
export class CarteiraService {

  constructor(
    private http: HttpClient
  ) {}

  public getCarteirinha(): Observable<any> {

    let cpf         = localStorage.getItem('cpfTitular');
    let nascimento  = localStorage.getItem('nascimentoFormatado');

    return this.http.get('https://apis.seconci-sp.org.br:3011/consultaClientes/carteirinha/' + cpf + '/' + nascimento, httpOptions );
  }

}

