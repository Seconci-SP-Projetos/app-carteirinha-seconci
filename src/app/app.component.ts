import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Router} from '@angular/router';
import 'hammerjs';
import { MultiService } from './services/multi.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Carteirinha Seconci SP';
 
  private intervalo;

  constructor( updateAvailable: SwUpdate,
               private multiService: MultiService,
               private router: Router ) {

      updateAvailable.available.subscribe(event => {
      document.location.reload();

    });

  }

  ngOnInit() {


    let matricula = localStorage.getItem('idBeneficiario');
    let nascimento = localStorage.getItem('nascimentoFormatado');

    if (matricula && nascimento) {
      this.multiService.loadAgendmentos()
        .subscribe( (numeroAgendamentos: number) => {
          this.multiService.verificaTelemedicinaAtiva();
          this.intervalo = setInterval(() => { console.log('... setInterval ...'); this.multiService.verificaTelemedicinaAtiva()}, 15000);
        });
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }

  logOff() {

    this.multiService.limpaAgendamentos();
    
    const localStrgValues = localStorage;
    for (const [key, data] of Object.entries(localStrgValues)) {
      if ('smsCodigoValidado,cpfTitular'.indexOf(key) === -1) {
        localStorage.removeItem(key);
      }
    }

    this.router.navigate(['./login']);
  }
  get loggedIn() { return localStorage.getItem('smsCodigoValidado') != null && localStorage.getItem('idBeneficiario') != null; }

  get compromissos() { return this.multiService.compromissosAtivos }

}
