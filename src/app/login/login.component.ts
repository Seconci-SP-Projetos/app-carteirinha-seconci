import { Component, OnInit, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoginService } from './login.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { CustomMessageComponent } from '../services/custom-message/custom-message.component';
import { MultiService } from '../services/multi.services';

interface smsResult {
  sendSmsResponse: {
    detailCode:         string;
    detailDescription:  string;
    statusCode:         string;
    statusDescription:  string;
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public formLogin: FormGroup;
  public sendingSMS: boolean = false;
  private _loginError: boolean = false;

  private fieldNames = [];
  private fieldIndex: number = 0;
  private fieldContentAfterEvent: string;

  private form;

  constructor(private formBuilder: FormBuilder,
              private loginService: LoginService,
              private route: ActivatedRoute,
              private router: Router,
              private bottomSheet: MatBottomSheet,
              private multiServices: MultiService
              ) {
    
    this.formLogin = formBuilder.group({
        cpfTitular: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
        diaNascimento: ['', [Validators.required, Validators.min(1), Validators.max(31)]],
        mesNascimento: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
        anoNascimento: ['', [Validators.required, Validators.min(1900)]], }
      );
   }

  ngOnInit() {
    this.fieldNames = ['cpfTitular', 'diaNascimento', 'mesNascimento', 'anoNascimento'];
  }

  noveNextInput(e) {

    const target = e.srcElement || e.target;
    const maxLength = parseInt(target.attributes["maxlength"].value, 10);
    const myLength = target.value.length;
    const fieldName = target.id;

    let fieldIndex;

    this.fieldNames.forEach( (field, idx) => {
      if (field === fieldName) {
        fieldIndex = idx;
      }
    });

    if (myLength >= maxLength  && e.keyCode !== 9) {

      fieldIndex = fieldIndex === this.fieldNames.length-1 ? 0 : ++fieldIndex;
      const nextField = document.getElementById( this.fieldNames[fieldIndex]);
      nextField.focus();
      this.fieldContentAfterEvent = '';
     } else if (myLength === 0 && fieldIndex !== 0 && e.keyCode === 8 && this.fieldContentAfterEvent.length === 0) {
      fieldIndex = --fieldIndex;
      const nextField = document.getElementById( this.fieldNames[fieldIndex]);
      nextField.focus()   
      this.fieldContentAfterEvent = target.value;
    } else {
      this.fieldContentAfterEvent = target.value;
    }
  }

  authenticate(event: Event) {

    event.preventDefault();

    let diaNascimento = '0' + this.diaNascimento.value; 
    let mesNascimento = '0' + this.mesNascimento.value; 

    diaNascimento = diaNascimento.substring(diaNascimento.length, diaNascimento.length-2);
    mesNascimento = mesNascimento.substring(mesNascimento.length, mesNascimento.length-2);

    let dataNascimento =  diaNascimento + mesNascimento + this.anoNascimento.value;

    return this.loginService.authenticate(this.cpfTitular.value, dataNascimento)
      .subscribe(dadosCliente => {    
        
        const idBeneficiario  = dadosCliente[0].ID_BENEFICIARIO;
        const ddd             = dadosCliente[0].NR_DDD_CELULAR ? dadosCliente[0].NR_DDD_CELULAR.trimRight() : '';
        const numeroCel       = dadosCliente[0].NR_FONE_CELULAR ?  dadosCliente[0].NR_FONE_CELULAR : '';

        const numeroCelular   = '55' + ddd + numeroCel;
        // const numeroCelular   = '5511999919474';
        const codigoSMS       = this.multiServices.geraRandomCode;

        localStorage.setItem('idBeneficiario', idBeneficiario);
        localStorage.setItem('numeroCelular', dadosCliente[0].NR_FONE_CELULAR);
        localStorage.setItem('numeroCelularCompleto', numeroCelular);
        localStorage.setItem('nascimentoFormatado', this.multiServices.formatDataSemBarras(dadosCliente[0].DT_NASCIMENTO));

        const smsCodigoValidado   = localStorage.getItem('smsCodigoValidado');
        const cpfTitularGravado   = localStorage.getItem('cpfTitular');
        const cpfTitularInformado = this.multiServices.cpfSomenteNumeros(dadosCliente[0].CPF_TITULAR);

        if ((smsCodigoValidado == null) || (cpfTitularGravado !== cpfTitularInformado)) {
          if (numeroCel !== '') {
            localStorage.removeItem('smsCodigoValidado');
            localStorage.setItem('cpfTitular', cpfTitularInformado);
            this.enviaCodigoSMS(idBeneficiario, numeroCelular, codigoSMS); 
          } else {
            let messageData = {
              success: false,
              message: 'Precisamos do número do celular para enviar um código de verificação mas ele é inválido. Por favor procure o Seconci e atualize seu cadastro.' }
            let bottomSheet = this.bottomSheet.open(CustomMessageComponent, { data: messageData });
            setTimeout( function() { bottomSheet.dismiss(false) }, 5000);

          }
        } else  {
          this.router.navigate(['../carteira'], { relativeTo: this.route });
        }
      },
      (error) => {
        if (error.status === 404) {
          this._loginError = true
         }
      });

  }

  enviaCodigoSMS(idBeneficiario: string, numeroCelular: string, codigoSMS: string) {

    this.sendingSMS = true;

    this.multiServices.enviarCodigoViaSMS(idBeneficiario, numeroCelular, codigoSMS)
    .subscribe( (resultadoEnvio: smsResult) => {

      this.sendingSMS = true;

      if(resultadoEnvio.sendSmsResponse.statusCode != "00") { 
        let messageData = {
          success: false,
          message: 'Ocorreu uma falha ao enviar o codigo de verificação via SMS para ' +  numeroCelular + '. Por favor, tente mais tarde.'
        }
        let bottomSheet = this.bottomSheet.open(CustomMessageComponent, { data: messageData });
        setTimeout( function() { bottomSheet.dismiss(false) }, 5000);
      } else {
        
        this.loginService.postCodigoSMS(idBeneficiario, codigoSMS)
        .subscribe( (result: any) => {
          if (! result.outBinds.errorCode) {
              this.router.navigate(['../validasms'], { relativeTo: this.route });
          } else {
            let messageData = {
              success: false,
              message: 'Ocorreu uma falha na gravação do código de verificação. Por favor, tente mais tarde.'
            }
            let bottomSheet = this.bottomSheet.open(CustomMessageComponent, { data: messageData });
            setTimeout( function() { bottomSheet.dismiss(false) }, 5000);
          }
        });
      }
    });

  }

  salvaCodigoVerificacao(idBeneficiario: string, codigoVerificacao: string) {

    return this.loginService.postCodigoSMS(idBeneficiario, codigoVerificacao)
      .subscribe(resultado => {   
        console.log(resultado)
      });
  }

  get cpfTitular() { return this.formLogin.controls['cpfTitular'] }
  get diaNascimento() { return this.formLogin.controls['diaNascimento'] }
  get mesNascimento() { return this.formLogin.controls['mesNascimento'] }
  get anoNascimento() { return this.formLogin.controls['anoNascimento'] }
  get loginError() { return this._loginError }

}
