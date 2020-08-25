import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Observable } from 'rxjs';

import { CustomMessageComponent } from '../services/custom-message/custom-message.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private _profileForm: FormGroup;
  private _profileError: boolean = false;
  private profile;
  private carteirinhas = [];
  private carteiraIndex: number = 0;

  constructor(
              private formBuilder: FormBuilder,
              private profileService: ProfileService,
              private bottomSheet: MatBottomSheet,
              private route: ActivatedRoute,
              private router: Router,
            ) {

              this._profileForm = formBuilder.group({
                cd_paciente:      ['', [Validators.required]],
                nr_ddd_celular:   ['', [Validators.required, Validators.pattern('[0-9]{2,4}')]],
                nr_fone_celular:  ['', [Validators.required, Validators.pattern('[0-9]{8,10}')]],
                cd_tp_logr:       ['', [Validators.required]],
                nm_tipo_logr:     ['', [Validators.required]],
                nm_logradouro:    ['', [Validators.required]],
                nr_logradouro:    ['', []],
                compl_logradouro: ['', []],
                cd_cidade:        ['', [Validators.required]],
                ds_cidade:        ['', [Validators.required]],
                cd_uf:            ['', [Validators.required]],
                bairro:           ['', [Validators.required]],
                email:            ['', [Validators.required,  Validators.maxLength(40), Validators.email]],
                rg_paciente:      ['', [Validators.required]],
                ocupacao:         ['', []],
                nm_mae:           ['', []] });

                this._profileForm.addControl('cep', new FormControl('', { validators: Validators.nullValidator, asyncValidators: this.validateCEP.bind(this), updateOn: 'blur' }));
                this._profileForm.addControl('cns', new FormControl('', { validators: Validators.nullValidator, asyncValidators: this.validateCNS.bind(this), updateOn: 'blur' }));
                
  }

  ngOnInit() {
    this.converteCarteirinha(localStorage.getItem('carteirinhas'));
    let idBeneficiario = localStorage.getItem('idBeneficiario');
    this.getProfile(idBeneficiario);
  }

  getProfile(idBeneficiario: string) {
    this.profileService.getClienteProfile(idBeneficiario)
    .subscribe( result => {
      this.profile = result[0];
      this.setProfileFormValues();
    }, 
    (error) => {if (error.status === 404) {
      this._profileError = true;
     }
    });
  }

  converteCarteirinha(carteirinhasString: string) {

    let regEx = /[^{]+\}/gi;

    let arrayCarteirinhas = carteirinhasString.match(regEx);

    arrayCarteirinhas.forEach( function(carteirinha: string, idx: number) { 
      let strCarteirinha = '{' + carteirinha;
      this.carteirinhas.push(JSON.parse(strCarteirinha))
      if (parseInt(localStorage.getItem('idBeneficiario')) === this.carteirinhas[idx].ID_BENEFICIARIO) {
        this.carteiraIndex = idx;
      }
    }.bind(this))

  }

  setProfileFormValues() {

    let formControls = this._profileForm.controls;
    let profile = this.profile;

    this._profileForm.setValue( {
          cd_paciente:      profile.CD_PACIENTE,
          nr_ddd_celular:   parseInt(profile.NR_DDD_CELULAR),
          nr_fone_celular:  parseInt(profile.NR_FONE_CELULAR),
          cd_tp_logr:       profile.CD_TP_LOGR,
          nm_tipo_logr:     profile.NM_TP_LOGR,
          nm_logradouro:    profile.NM_LOGRADOURO,
          nr_logradouro:    parseInt(profile.NR_LOGRADOURO),
          compl_logradouro: profile.COMPL_LOGRADOURO,
          cep:              profile.CEP,
          cd_cidade:        profile.CD_CIDADE,
          ds_cidade:        profile.DS_CIDADE,
          cd_uf:            profile.CD_UF,
          bairro:           profile.BAIRRO,
          email:            profile.EMAIL,
          rg_paciente:      profile.RG_PACIENTE,
          ocupacao:         profile.OCUPACAO,
          nm_mae:           profile.NM_MAE, 
          cns:              profile.CNS 
    })

  }

  mostraAnterior() {
    this.carteiraIndex = this.carteiraIndex === 0 ? this.carteirinhas.length-1 : --this.carteiraIndex;
    let idBeneficiario = this.carteirinhas[this.carteiraIndex].ID_BENEFICIARIO;
    this.getProfile(idBeneficiario);
  }
  
  mostraPosterior() {
    this.carteiraIndex = this.carteiraIndex === this.carteirinhas.length-1 ? 0 : ++this.carteiraIndex;
    let idBeneficiario = this.carteirinhas[this.carteiraIndex].ID_BENEFICIARIO;
    this.getProfile(idBeneficiario);
  }

  saveProfile(event) {

    let submitProfile = {
      v_matricula:        this._profileForm.value.cd_paciente,
      v_ddd:              this._profileForm.value.nr_ddd_celular.toString(),
      v_nrCelular:        this._profileForm.value.nr_fone_celular.toString(),
      v_tipoLogradouro:   this._profileForm.value.cd_tp_logr,
      v_nmLogradouro:     this._profileForm.value.nm_logradouro,
      v_nrLogradouro:     ! this._profileForm.value.nr_logradouro ? '' : this._profileForm.value.nr_logradouro.toString(),
      v_complLogradouro:  ! this._profileForm.value.compl_logradouro ? '' : this._profileForm.value.compl_logradouro,
      v_cep:              this._profileForm.value.cep,
      v_cdCidade:         this._profileForm.value.cd_cidade,
      v_uf:               this._profileForm.value.cd_uf,
      v_bairro:           this._profileForm.value.bairro,
      v_email:            this._profileForm.value.email,
      v_rg:               ! this._profileForm.value.rg_paciente ? '' : this._profileForm.value.rg_paciente,
      v_ocupacao:         ! this._profileForm.value.ocupacao ? '' : this._profileForm.value.ocupacao,
      v_nmMae:            ! this._profileForm.value.nm_mae ? '' : this._profileForm.value.nm_mae,
      v_cns:              ! this._profileForm.value.cns ? '' : this._profileForm.value.cns
    }

    console.log(submitProfile);
    this.profileService.updateProfile(submitProfile)
      .subscribe(result => {
        let messageData = {
          success: true,
          message: 'Dados cadastrais atualizados com sucesso'
        }
        let bottomSheet = this.bottomSheet.open(CustomMessageComponent, { data: messageData });
        setTimeout( function() { bottomSheet.dismiss(false) }, 3000);
      },
      (error) => {
        let messageData = {
          success: false,
          message: 'Ocorreu uma falha durante a atualização. Por favor tente mais tarde.'
        }
        this.bottomSheet.open(CustomMessageComponent, { data: messageData });
      });

  }

  validateCEP(control: AbstractControl): Promise<any>  {

    let controlValue = control.value;

    if (controlValue && controlValue != '') {
      return this.profileService
        .getCEP(controlValue)
        .toPromise()
        .then(cepRetornado => {
          this._profileForm.patchValue({
            cd_uf          : cepRetornado[0].UF,
            cd_cidade      : cepRetornado[0].cdCidade,
            ds_cidade      : cepRetornado[0].dsCidade,
            nm_tipo_logr   : cepRetornado[0].dsTipoLogradouro,
            nm_logradouro  : cepRetornado[0].nmLogradouro,
            cd_tp_logr     : cepRetornado[0].tipoLogradouro,
            bairro         : cepRetornado[0].dsBairro
          });
          return null;
        })
        .catch( error => { 
          return { invalidCEP: true 
        } });
    } else {
      return Observable.create(function (observer) { observer.next(null); observer.complete(); });
    }
  }

  validateCNS(control: AbstractControl) {

    let reg1 = /[1-2]\d{10}00[0-1]\d/;
    let reg2 = /[7-9]\d{14}/;

    let CNSnumber: string =   control.value;
    
    if (reg1.test(CNSnumber)) {
      
      let root = CNSnumber.toString().substr(0, 11);

      return new Promise( (resolve) => {
        
        let remainder      = this.somaPonderada(CNSnumber, 11) % 11;
        let digit          = 11 - remainder;
        let producedNumber = '';

        if (digit == 11)  { digit = 0; }

        if (digit == 10) {
          remainder       = (this.somaPonderada(CNSnumber, 11) + 2) % 11; 
          digit           = 11 - remainder;
          producedNumber  = root + '001' + digit;
          
        } else {
          producedNumber  = root + '000' + digit;

        }

        resolve(CNSnumber == producedNumber ? null : {'invalidCNS': true});

      });
    } else if (reg2.test(CNSnumber)) {

      let remainder = this.somaPonderada(CNSnumber, 15) % 11;

      if (remainder != 0){
        return new Promise( (resolve) => { resolve({'invalid': true}); });
      } else {
          return new Promise( (resolve) => { resolve(null); });
      }

    } else {
      return new Promise( (resolve) => { resolve(false); });
    }
  }
  
  private somaPonderada(CNSnumber: string, limit: number) {
    
    let numbersArray = CNSnumber.split('');
    let sum = 0;
    
    for (let index = 0; index < limit; index++) {
      sum = sum + parseInt(numbersArray[index]) * (15 - index);
    }

    return sum;

  }

  get nomePaciente() { return this.carteirinhas[this.carteiraIndex].NM_BENEFICIARIO; }
  get profileForm() { return this._profileForm; }
  get profileError() { return this._profileError; }

  get nr_ddd_celular() { return this._profileForm.get('nr_ddd_celular'); }

  get nr_fone_celular() { return this._profileForm.get('nr_fone_celular'); }
  get rg_paciente() { return this._profileForm.get('rg_paciente'); }

  get nm_tipologr() { return this._profileForm.get('nm_tipo_logr'); }
  get nm_logradouro() { return this._profileForm.get('nm_logradouro'); }
  get nr_logradouro() { return this._profileForm.get('nr_logradouro'); }
  get bairro() { return this._profileForm.get('bairro'); }
  get ds_cidade() { return this._profileForm.get('ds_cidade'); }
  get cd_uf() { return this._profileForm.get('cd_uf'); }
  get cep() { return this._profileForm.get('cep'); }
  get email() { return this._profileForm.get('email'); }
  get cns() { return this._profileForm.get('cns'); }

}