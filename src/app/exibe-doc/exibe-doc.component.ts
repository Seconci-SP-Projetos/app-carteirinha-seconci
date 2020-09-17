import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-exibe-doc',
  templateUrl: './exibe-doc.component.html',
  styleUrls: ['./exibe-doc.component.scss']
})
export class ExibeDocComponent implements OnInit {

  private docUrl;
  public loading: boolean = true;

  constructor(private route: ActivatedRoute,
              private http: HttpClient ) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.docUrl = "../../assets/laudo_pdf/" + params['docUrl'];
    });

  }

  get getDocUrl() { return this.docUrl; }
  
  finished(event) {
   this.loading = false;
  }

  download(event) {
    
    console.log('pressed')

    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    this.http.get('../../assets/docs/manual_usuario_seconci.pdf', { headers: headers, responseType: 'blob' }).subscribe(result => {
      console.log('download finished')
    });
  }

  downloadPDF(pdfFile: string) {
    window.location.href=pdfFile;
  }
}
