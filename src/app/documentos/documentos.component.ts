import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DocumentosService } from './documentos.service';

const httpOptions = {
   headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {

  public htmlData;
  public documentos;

  private _loaded: boolean = false;

  constructor(private sanitizer: DomSanitizer,
              private http: HttpClient,
              private documentosService: DocumentosService,
              private router: Router) { }

  ngOnInit() {

    this.documentosService.getDocumentos()
      .subscribe((result) => {
        this.documentos = result;
        console.log(this.documentos.length);
        this._loaded = true;
      },
      (error) => {
        this.documentos = [];
        this._loaded = true;
      })
  }

  exibeDocumento(nrAtendimento: number,
                 anoAtendimento: number,
                 cdCredenciado: number, 
                 cdProcedimento: number,
                 Matricula: number ) {

    // const regExStart  = /src=/
    // const regExEnd    = /toolbar=1/    
    
    // if (regExStart.exec(htmlUrl)) {
    //   let locateStart = regExStart.exec(htmlUrl).index+5;
    //   let locateEnd   = regExEnd.exec(htmlUrl).index;
    //   var docUrl = htmlUrl.substr(locateStart, locateEnd-locateStart);
    // } else {
    //   var docUrl = htmlUrl;
    // }

    // console.log('URL A SER CHAMADO:', docUrl);
    // this.router.navigate(['/exibeDoc', { docUrl: docUrl }]);

    this.documentosService.getDocumentoEmPDF(nrAtendimento,  anoAtendimento, cdCredenciado,  cdProcedimento, Matricula )
      .subscribe((result) => {
        // this.documentos = result;
        console.log(result[0].Laudo_pdf);
        let docUrl = result[0].Laudo_pdf
        console.log('URL A SER CHAMADO:', docUrl);
        this.router.navigate(['/exibeDoc', { docUrl: docUrl }]);
        this._loaded = true;
      },
      (error) => {
        this.documentos = [];
        this._loaded = true;
      })
  }

  get pacienteSelecionado() { return localStorage.getItem('beneficiario') }

  get loaded() { return this._loaded; }
}

