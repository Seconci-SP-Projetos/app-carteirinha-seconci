import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Router } from '@angular/router';
import 'hammerjs';
import { MultiService } from './services/multi.services';
import { ConnectionService } from 'ng-connection-service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  status = 'ONLINE';
  isConnected = true;

  title = 'Carteirinha Seconci SP';

  private intervalo;

  constructor(updateAvailable: SwUpdate,
    private multiService: MultiService,
    private router: Router, private connectionService: ConnectionService, private snackBar: MatSnackBar) {

    updateAvailable.available.subscribe(event => {
      document.location.reload();
    });

    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
        this.openSnackBar(this.status, 'fechar')
      }
      else {
        this.status = "OFFLINE";
        this.openSnackBar(this.status, 'fechar')
      }
    })


  }

  ngOnInit() {


    let matricula = localStorage.getItem('idBeneficiario');
    let nascimento = localStorage.getItem('nascimentoFormatado');

    if (matricula && nascimento) {
      this.multiService.loadAgendmentos()
        .subscribe((numeroAgendamentos: number) => {
          this.multiService.verificaTelemedicinaAtiva();
          this.intervalo = setInterval(() => { console.log('... setInterval ...'); this.multiService.verificaTelemedicinaAtiva() }, 15000);
        });
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      // here specify the position
      verticalPosition: 'top'
    });
  }

  logOff() {

    this.multiService.limpaAgendamentos();

    const localStrgValues = localStorage;
    for (const [key, data] of Object.entries(localStrgValues)) {
      if ('smsCodigoValidado,cpfTitular'.indexOf(key) === -1) {
        localStorage.removeItem(key);
      } else if (key === 'smsCodigoValidado' && localStorage.getItem('smsCodigoValidado') === '668799') {
        localStorage.removeItem(key);
      }
    }

    this.router.navigate(['./login']);
  }
  get loggedIn() { return localStorage.getItem('aceiteTermo') != null && localStorage.getItem('idBeneficiario') != null; }
  // get autenticado() { return localStorage.getItem('smsCodigoValidado') != null && localStorage.getItem('smsCodigoValidado') != '668799'}
  get compromissos() { return this.multiService.compromissosAtivos }

}
