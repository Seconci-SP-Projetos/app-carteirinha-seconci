import { Component, OnInit, Inject } from '@angular/core';
import { CarteiraService } from './carteira.service';
import { MultiService } from '../services/multi.services';

interface carteira {
    CNPJ:                   string
    COD_TIPO_BENEFICIARIO:  number;
    CPF_TITULAR:            string;
    DT_NASCIMENTO:          string;
    ID_BENEFICIARIO:        number;
    LOCALIZACAO:            string;
    NM_BENEFICIARIO:        string;
    NOME_TITULAR:           string;
    RAZAO:                  string;
    TELEFONE:               string;
    TIPO_BENEFICIARIO:      string;
    UNIDADE:                string;
    tpCobertura:            string;
    frente:                 boolean;
}

@Component({
  selector: 'app-carteira',
  templateUrl: './carteira.component.html',
  styleUrls: ['./carteira.component.scss']
})


export class CarteiraComponent implements OnInit {

  public promptEvent;

  public result;
  public carteiras: Array<carteira> = [];
  public frenteVerso: boolean = true;


  private nome: string;

  constructor(private carteriaService: CarteiraService,
              private multiServices: MultiService ) {

    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      this.promptEvent = event;
    });
  }

  ngOnInit() {

    if ( localStorage.getItem('carteirinhas') === null ) {
      this.carteriaService.getCarteirinha()
      .subscribe( result => {
        this.carteiras = result;
        localStorage.setItem('carteirinhas', JSON.stringify(result));
        this.multiServices.setLocalStroageComDadosCliente(result[0])
        this.setCarteirinhasFrente();
      })
    } else {
      this.carteiras =  JSON.parse(localStorage.getItem('carteirinhas'));
      this.setCarteirinhasFrente();
    }
  }

  setCarteirinhasFrente() {
    for(let index = 0; index < this.carteiras.length; index++) {
      this.carteiras[index].frente = true;
    }
  }

  setCliente(index: number) {
    this.multiServices.setLocalStroageComDadosCliente(this.carteiras[index]);
  }

  mostraFrente(index: number) { 
    this.carteiras[index].frente = true; 
  }
  mostraVerso(index: number) { 
    this.carteiras[index].frente = false; 
  }

  get frente() { return  this.frenteVerso }
  get beneficiarioSelecionado() { return localStorage.getItem('idBeneficiario')}
}
