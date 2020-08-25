import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AgendaService } from '../agenda/agenda.service';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime } from 'rxjs/operators';

const TEMPO_ANTECEDENCIA_ABERTURA_SALA = 10; 
const ALERTAS_AGENDAMENTO = 5;

@Injectable({
    providedIn: 'root'
  })

export class MultiService {

    public agendamentos = [];
    private audio = new Audio();
    public _loaded: boolean = false;
    public _loading: boolean = false;

    public compromissosAtivos = 0;

    constructor( private http: HttpClient,
                 private agendaService: AgendaService, ) {}

    formatDataSemBarras(data: string): string {

        let regExp = /\//g;
        let dataSemBarras = data.replace(regExp, '');

        return dataSemBarras;

    }

    cpfSomenteNumeros(cpfCompelto: string) {

        let regExp = /[-.]/g;
        let cpfNumeros = cpfCompelto.replace(regExp, '');

        return cpfNumeros;
    }

    setLocalStroageComDadosCliente(dadosCliente: any) {

        localStorage.setItem('nascimentoFormatado', this.formatDataSemBarras(dadosCliente.DT_NASCIMENTO));
    
        localStorage.setItem('unidade', dadosCliente.UNIDADE);
        localStorage.setItem('codUnidade', dadosCliente.CD_HOSPITAL);
        localStorage.setItem('telefone', dadosCliente.TELEFONE);
        
        localStorage.setItem('cnpj', dadosCliente.CNPJ);
        localStorage.setItem('tipoBeneficiario', dadosCliente.TIPO_BENEFICIARIO);
        localStorage.setItem('nascimento', dadosCliente.DT_NASCIMENTO);
        localStorage.setItem('idBeneficiario', dadosCliente.ID_BENEFICIARIO);
        localStorage.setItem('localizacao', dadosCliente.LOCALIZACAO);
        localStorage.setItem('beneficiario', dadosCliente.NM_BENEFICIARIO);
        localStorage.setItem('nomeTitula', dadosCliente.NOME_TITULAR);
        localStorage.setItem('razao', dadosCliente.RAZAO);
        localStorage.setItem('cpfTitular', this.cpfSomenteNumeros(dadosCliente.CPF_TITULAR));
        localStorage.setItem('titular', dadosCliente.TITULAR);
        localStorage.setItem('tipoBeneficiario', dadosCliente.TIPO_BENEFICIARIO);
        localStorage.setItem('tipoCobertura', dadosCliente.tpCobertura);

        const ddd       = dadosCliente.NR_DDD_CELULAR ? dadosCliente.NR_DDD_CELULAR.trimRight() : '';
        const numero    = dadosCliente.NR_FONE_CELULAR ?  dadosCliente.NR_FONE_CELULAR : '';

        localStorage.setItem('numeroCelular', '0' + ddd + numero);
    }

        
    enviarCodigoViaSMS(idBeneficiario: string, numeroCelular: string, codigoVerificacao: string) {

        let smsObject = {
        "sendSmsRequest": {
            "from": "Seconci-SP",
            "to": numeroCelular,
            // "to": '5511999919474',
            "msg": "Seu código de verificação de acesso ao aplicativo do Seconci: " + codigoVerificacao,
            "callbackOption": "NONE",
            "aggregateId": "73160",
            "id": idBeneficiario + ':' + codigoVerificacao,
            "flashSms": false
        } };

        let smsService = 'https://api-rest.zenvia.com/services/send-sms';

        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type':   'application/json',
            'Accept':         'application/json',
            'Authorization':  'Basic c2Vjb25jaTpGNHJ5WmNuOUpu'
            }) }

        return this.http.post(smsService, JSON.stringify(smsObject), httpOptions);
    }

    get geraRandomCode() {

        let confirmCode = '';

        while (confirmCode.length < 6) {
          let randomDigit = Math.floor(Math.random() * 10);
          if (confirmCode.indexOf(randomDigit.toString()) === -1) {
            confirmCode += randomDigit;
          }
        }
    
        return confirmCode;

    }

    loadAgendmentos(): Observable<any>  {

      return this.agendaService.getAgendamento().pipe( map((result) => {
          
              this.agendamentos = [];

              var diaAnterior = null;
              var mesAnterior = null;

              this._loaded    = false;

              result.forEach( (compromisso, index) => {

                  console.log('processing agendamentos');

                  let dayString = compromisso.DT_COMPROMISSO.substring(0, 2);
                  
                  let day = parseInt(compromisso.DT_COMPROMISSO.substring(0, 2));
                  let month = parseInt(compromisso.DT_COMPROMISSO.substring(3, 5))-1;
                  let year = parseInt(compromisso.DT_COMPROMISSO.substring(6, 10));

                  let hour  = parseInt(compromisso.HORA_COMPROMISSO.substring(0, 2));
                  let min   = parseInt(compromisso.HORA_COMPROMISSO.substring(3, 5));

                  const event = new Date(year, month, day, hour, min, 0);

                  var diaSemana = new Intl.DateTimeFormat('pt', { weekday: 'long'}).format(event);
                  var mesAno = new Intl.DateTimeFormat('pt', { month: 'short' }).format(event) + compromisso.DT_COMPROMISSO.substring(6, 10);

                  var ativaTelemedicina = this.ativaTelemedicina(event) ;

                  let compromissoFormatado = {
                      "diaString":          dayString,
                      "dia":                (diaAnterior != day || mesAnterior != month) ? day : '',
                      "diaSemana":          (diaAnterior != day || mesAnterior != month) ? diaSemana : '',
                      "mesAno":             mesAno,
                      "data":               compromisso.DT_COMPROMISSO,
                      "hora":               compromisso.HORA_COMPROMISSO,
                      "medico":             compromisso.COMPROMISSO,
                      "recurso":            compromisso.cdRecurso,
                      "mensegem":           compromisso.MENSAGEM,
                      "quantidade":         compromisso.qtde,
                      "procedimento":       compromisso.dsProcedimento,
                      "teleMedicina":       compromisso.teleMedicina,
                      "salaTelemedicina":   compromisso.salaTelemedicina,
                      "soundAlert":         false,
                      "soundOn":            true,
                      "alertEvent":         null,
                      "ativaTelemedicina":  ativaTelemedicina,
                      "tempoAtivacao":      event,
                      "exames":             null,
                      "exibeExames":        false,
                      "procedimentoUnico":  null,
                      "exibeProcedimento":  false
                  }

              diaAnterior = day;
              mesAnterior = month;

              if (index <= this.agendamentos.length) {
                this.agendamentos.push(compromissoFormatado);
              } else {

                this.agendamentos[index] = compromissoFormatado;
              }
          });

          let startDeletion = result.length+1;
          let endDeletion   = this.agendamentos.length;

          if (endDeletion >= startDeletion) {
            for (let index = startDeletion; startDeletion <= endDeletion; index++) {
              this.agendamentos.splice(index, 1);
            }
          }

          this._loaded = true;
          return of(this.agendamentos.length);  
      }), 
      catchError(err => {
          this._loaded = true;
          return of(0);
      }))

    }

    verificaTelemedicinaAtiva() {

        const totalCompromissos = this.agendamentos.length;
        const now = new Date();
        const agora = now.valueOf();
    
        this.compromissosAtivos = 0;

        for( let index = 0; index < totalCompromissos; index++ ) {
            if ( this.agendamentos[index].teleMedicina == 'S') {

                const ativaTelemedicina = this.ativaTelemedicina(this.agendamentos[index].tempoAtivacao);
                this.agendamentos[index].ativaTelemedicina = ativaTelemedicina ? 'S' : 'N';
                
                this.compromissosAtivos = ativaTelemedicina ? ++this.compromissosAtivos : this.compromissosAtivos;
      
                if ( ativaTelemedicina && ! this.agendamentos[index].soundAlert) {
                  this.agendamentos[index].soundAlert = true;
                  this.agendamentos[index].alertEvent = setTimeout(() => { this.playAlert(index, ALERTAS_AGENDAMENTO)}, 60000);
                } else {
                  this.agendamentos[index].soundAlert = ativaTelemedicina;
                }
            }
        }
      }

      
  ativaTelemedicina(evento) {
    
    const antecedencia = TEMPO_ANTECEDENCIA_ABERTURA_SALA;

    const now = new Date();

    // console.log('Evento', evento)
    // console.log('Agora', now)
    // console.log('---------------------------------')

    var diffMs = evento.valueOf() - now.valueOf(); // milliseconds entre o evento e agora
    var diffDays = Math.floor(diffMs / 86400000); // diferenca em dias
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // diferenca em horas
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // diferenca em minutos

    const limiteMinutosAlcancado = (diffDays <= 0) && (diffHrs <= 0) && (diffMins <= 5);

    // console.log('Diferença mes    ', diffMs);
    // console.log('Diferença dias   ', diffDays);
    // console.log('Diferença horas  ', diffHrs);
    // console.log('Diferença minutos', diffMins);
    // console.log('---------------------------------')
    // console.log('limite alcançado   ', limiteMinutosAlcancado);
    // console.log('Ativar telemedicina', limiteMinutosAlcancado && ( (diffDays == 0 || diffDays == -1) && (diffHrs == 0 || diffHrs == -1) && (diffHrs <= 5 && diffHrs >= -30)));

    // Cinco minutos antes no mesmo dia e não mais do que duas horas depois
    return limiteMinutosAlcancado && ( (diffDays == 0 || diffDays == -1) && (diffHrs == 0 || diffHrs == -1) && (diffMins <= 5 && diffMins >= -30));  

  }

  playAlert(index, repeat) {

    let again = --repeat;
    
    if (this.agendamentos[index].soundOn) {
      console.log('soando alarme', repeat, index)
      this.audio.src = '../../assets/sounds/Electronic_Chime-KevanGC-495939803.wav';
      this.audio.play();
    }

    if (again > 0) {
      this.agendamentos[index].alertEvent  = setTimeout(() => { this.playAlert(index, again)}, 60000);
    }

  }

  get agendaCarregada() {
    return this.agendamentos.length > 0;
  }

  get totalAgendamentos() {
    return this.agendamentos.length;
  }

  toggleSound(index: number) {
    console.log('toggle', index)
    this.agendamentos[index].soundOn = !this.agendamentos[index].soundOn;
  }

  limpaAgendamentos() {

    this.agendamentos.forEach( compromisso => {
        if (compromisso.alertEvent) {
            clearTimeout(compromisso.alertEvent)
        }
    })
    this.agendamentos = [];

  }
}