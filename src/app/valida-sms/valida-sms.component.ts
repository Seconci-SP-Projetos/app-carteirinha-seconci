import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidaSMSService } from './valida-sms.service';
import { MultiService } from '../services/multi.services';
import { MatSnackBar } from '@angular/material/snack-bar';

interface smsResult {
  sendSmsResponse: {
    detailCode:         string;
    detailDescription:  string;
    statusCode:         string;
    statusDescription:  string;
  }
}

@Component({
  selector: 'app-valida-sms',
  templateUrl: './valida-sms.component.html',
  styleUrls: ['./valida-sms.component.scss']
})

export class ValidaSMSComponent implements OnInit {

  public formSMS: FormGroup;
  private _erroValidacao: boolean = false;
  public apiAccess: boolean = false;

  constructor(  private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private validaSMSService: ValidaSMSService,
                private multiServices: MultiService,
                private snackBar: MatSnackBar 
    ) {

      

  this.formSMS = formBuilder.group({
    codigoVerificacao: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
  });
    
  }

  ngOnInit() {
  }

  validaSMS(event: Event) {

    event.preventDefault();

    let idBeneficiario  = localStorage.getItem('idBeneficiario');
    let codigoSMS       = this.formSMS.controls['codigoVerificacao'].value;

    this.apiAccess = true;

    this.validaSMSService.validaCodigo(idBeneficiario, codigoSMS)
      .subscribe( (result: any) => {
        if (! result.outBinds.errorCode) {
          localStorage.setItem('smsCodigoValidado', codigoSMS);
          this.multiServices.loadAgendmentos()
          .subscribe( (numeroAgendamentos: number) => {
            setInterval(() => { this.multiServices.verificaTelemedicinaAtiva()}, 10000);
            this.router.navigate(['../carteira'], { relativeTo: this.route });
          });
        } else {
          this._erroValidacao = true;
          this.apiAccess = false;
        }
      },
      (error) => {
        this._erroValidacao = true;
        this.apiAccess = false;

      })

  
  }

  reenviaSMS(event: Event) {

    event.preventDefault();

    const idBeneficiario  = localStorage.getItem('idBeneficiario');
    const numeroCelular   = localStorage.getItem('numeroCelularCompleto');
    const codigoSMS       = this.multiServices.geraRandomCode;

    this.apiAccess = true;

    this.multiServices.enviarCodigoViaSMS(idBeneficiario, numeroCelular, codigoSMS)
      .subscribe( (resultadoEnvio: smsResult) => {
  
        if (resultadoEnvio.sendSmsResponse.statusCode != "00") { 
          const message = 'Falha ao enviar o codigo de verificação via SMS para ' +  numeroCelular + '. Por favor, tente mais tarde.'
          let snackBarRef = this.snackBar.open(message, ' ', { duration: 5000 });
        } else {
          this.validaSMSService.postCodigoSMS(idBeneficiario, codigoSMS)
                .subscribe( (result: any) => {
                  if (! result.outBinds.errorCode) {
                      this.router.navigate(['../validasms'], { relativeTo: this.route });
                  } else {
                    const message = 'Ocorreu uma falha na gravação do código de verificação. Por favor, tente mais tarde.'
                    let snackBarRef = this.snackBar.open(message, ' ', { duration: 5000 });
                  }
                });
        }
        this.apiAccess = false;
      },
      (error) => {
        const message = 'Falha ao enviar o codigo de verificação via SMS para ' +  numeroCelular + '. Por favor, tente mais tarde.'
        let snackBarRef = this.snackBar.open(message, ' ', { duration: 5000 });
        this.apiAccess = false;
      });

  }

  removeErrorValidacao() {
    this._erroValidacao = false;
  }
  get erroValidacao() { return this._erroValidacao; }
  get codigoVerificacao() { return this.formSMS.value.codigoVerificacao }
  
}