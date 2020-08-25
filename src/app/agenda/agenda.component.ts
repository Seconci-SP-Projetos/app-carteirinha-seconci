import { Component, OnInit } from '@angular/core';
import { AgendaService } from './agenda.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MultiService } from '../services/multi.services';
import { Observable, fromEvent } from 'rxjs';
import * as Hammer from 'hammerjs';
import { HammerGestureConfig } from '@angular/platform-browser';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {


  public telefoneUnidade = localStorage.getItem('telefone');
  public nomeUnidade = localStorage.getItem('unidade');

  private intervalo;
  private primeiroDetalhe: boolean = true;
 
  public reloading: boolean = false;

  constructor( private agendaService: AgendaService,
               public multiService: MultiService,
               private snackBar: MatSnackBar  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    
    this.loadAgendamentos();

    var myElement = document.getElementById('agendaContainer');
    var mc = new Hammer(myElement);
   
    mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }

  loadAgendamentos() {

    // prevent scrolling, so the drag/swipe handler is getting called
   clearInterval(this.intervalo);

   this.reloading = true;

   const agendaCarregada = this.multiService.agendaCarregada;

   this.multiService.loadAgendmentos()
     .subscribe(  (numAgendamentos) => {
       if (numAgendamentos.value > 0) {
         this.multiService.verificaTelemedicinaAtiva();
         this.intervalo = setInterval(() => { this.multiService.verificaTelemedicinaAtiva()}, 10000);
         if (!agendaCarregada) {
           this.snackBar.open('Toque no compromisso para maiores informações.', ' ', { duration: 3000 });
         }
       }
       setTimeout( () => { this.reloading = false }, 1000); 
     }, 
     () => {  
       this.snackBar.open('Ocorreu um erro durante o processo de carga da agenda.', ' ', { duration: 3000 });
       this.reloading = false; 
     });

  }

  carregaPreparoExame(index: number,recurso: string, data: string, hora: string ) {
    
    if (this.multiService.agendamentos[index].procedimentoUnico == null) {

      const regEx = /(\:|\/)/g
      const matricula = localStorage.getItem('idBeneficiario') ;
      const dataFormatada = data.replace(regEx, '');
      const horaFormatada = hora.replace(regEx, '');

      this.agendaService.getExames(matricula, recurso, dataFormatada, horaFormatada)
      .subscribe( (exame) => { 

        const codigoPreparo = exame[0].CD_PROCEDIMENTO;

        this.agendaService.getPreparo(codigoPreparo)
        .subscribe( (preparo) => {
          this.multiService.agendamentos[index].procedimentoUnico = preparo[0].TX_PREPARO;
          this.multiService.agendamentos[index].exibeProcedimento = true;
        }, (erro) => {
          this.snackBar.open('Sem informações de peparo para este agendamento.', ' ', {
            duration: 2000 });
        });
      }, (erro) => {
        this.snackBar.open('Sem mais informações sobre este exame.', ' ', {
          duration: 2000 });
      }); 
    } else {
      this.multiService.agendamentos[index].exibeProcedimento = !this.multiService.agendamentos[index].exibeProcedimento;
    }

  }

  carregaExames(index: number, recurso: string, data: string, hora: string ) {

    if (this.multiService.agendamentos[index].exames == null) {

      const regEx = /(\:|\/)/g
      const dataFormatada = data.replace(regEx, '');
      const horaFormatada = hora.replace(regEx, '');
  
      const matricula = localStorage.getItem('idBeneficiario') ;
  
      this.agendaService.getExames(matricula, recurso, dataFormatada, horaFormatada)
        .subscribe( (exames: any) => {

          if (exames.length > 1) {
            this.multiService.agendamentos[index].exames = exames;
            this.multiService.agendamentos[index].exibeExames = true;
            if(this.primeiroDetalhe) {
              this.snackBar.open('Toque no nome do procedimento para informações de preparo.', ' ', {
                duration: 3000 });
                this.primeiroDetalhe = false;
            }
          } else {
            this.snackBar.open('Sem maiores informações para este procedimento.', ' ', {
              duration: 2000 });
          }
        }, 
        (erro) => {
            this.snackBar.open('Sem maiores informações para este procedimento.', ' ', {
              duration: 2000 });
        });
    } else {
      this.multiService.agendamentos[index].exibeExames = !  this.multiService.agendamentos[index].exibeExames;
    }

  }

  carregaPreparo(indexAgenda: number, indexExame: number, codigoPreparo: string ) {
      if (this.multiService.agendamentos[indexAgenda].exames[indexExame].preparo === undefined) {
        console.log('procedimento nao carregado')
        this.agendaService.getPreparo(codigoPreparo)
          .subscribe( (preparo) => {
          this.multiService.agendamentos[indexAgenda].exames[indexExame].exibePreparo = true;
          this.multiService.agendamentos[indexAgenda].exames[indexExame].preparo = preparo[0].TX_PREPARO;
        })
      } else {
        this.multiService.agendamentos[indexAgenda].exames[indexExame].exibePreparo = ! this.multiService.agendamentos[indexAgenda].exames[indexExame].exibePreparo;
      }
   }

  iniciaTelemedicina(nomeSala: string) {

    const totalCompromissos = this.multiService.agendamentos.length;
    for( let index = 0; index < totalCompromissos; index++ ) {
      if(this.multiService.agendamentos[index].alertEvent != null) {
        clearTimeout(this.multiService.agendamentos[index].alertEvent);
        this.multiService.agendamentos[index].alertEvent = null;
      }
    }
    document.location.href = "https://seconci.whereby.com/" + nomeSala;
  }

  get pacienteSelecionado() { return localStorage.getItem('beneficiario') }

  get loaded() { return this.multiService._loaded; }

}