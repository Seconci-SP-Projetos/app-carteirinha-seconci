import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TermoAceiteService } from './termo-aceite.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { CustomMessageComponent } from '../services/custom-message/custom-message.component';


@Component({
  selector: 'termo-aceite',
  templateUrl: './termo-aceite.component.html',
  styleUrls: ['./termo-aceite.component.scss']
})
export class TermoAceiteComponent implements OnInit {

  private docUrl;
  public loading: boolean = true;

  constructor(private route: ActivatedRoute,
              private termoAceiteService: TermoAceiteService,
              private http: HttpClient,
              private bottomSheet: MatBottomSheet,
              private router: Router ) { }

  ngOnInit() {


  }

  get nomeBeneficiario() {
    return localStorage.getItem('beneficiario');
  }


  aceito() {

    let aceite = {
      "beneficiario": localStorage.getItem("idBeneficiario"),
      "resposta": "S",
      "detalhesAutenticacao": "Autenticacao com sucesso"
    }

    this.termoAceiteService.registraAceite(aceite)
    .subscribe(result => {

      let momentoAceite = new Date();
      let aceiteString: string = momentoAceite.toString();

      localStorage.setItem('aceiteTermo', aceiteString);
      this.router.navigate(['./agenda']);

    },
    (error) => {
      let messageData = {
        success: false,
        message: 'Ocorreu uma falha durante a atualização. Por favor tente mais tarde.'
      }
      this.bottomSheet.open(CustomMessageComponent, { data: messageData });
    });
  }

  naoAceito() {
   localStorage.clear();
   this.router.navigate(['./login']);
  }

}
