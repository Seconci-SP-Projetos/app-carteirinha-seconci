import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
   headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*'
  })

};

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit  {

  unidade : string = 'Seconci São Paulo';
  lat: number =-23.531359;
  lng: number = -46.664326;
  zoom: number = 18;

  unidades = {
    28:   {'text': 'Unidade ABC',                   'lat': -23.651910, 'lng': -46.533996},
    36:   {'text': 'Unidade Bauru',                 'lat': -22.328339, 'lng': -49.069492},
    40:   {'text': 'Unidade Campinas',              'lat': -22.906282, 'lng': -47.066806},
    39:   {'text': 'Unidade Cubatão',               'lat': -23.885667, 'lng': -46.424313},
    37:   {'text': 'Unidade Mogi das Cruzes',       'lat': -23.530603, 'lng': -46.202428},
    150:  {'text': 'Unidade Praia Grande',          'lat': -24.010838, 'lng': -46.418418},
    120:  {'text': 'Unidade Piracicaba',            'lat': -22.730214, 'lng': -47.650631},
    31:   {'text': 'Unidade Ribeirão Preto',	      'lat': -21.182142, 'lng': -47.802343},
    160:  {'text': 'Unidade Riviera',               'lat': -23.789250, 'lng': -46.032154},
    20:   {'text': 'Unidade Santos',                'lat': -23.960516, 'lng': -46.314676},
    70:   {'text': 'Unidade São José dos Campos',   'lat': -23.195028, 'lng': -45.883864},
    1:    {'text': 'Unidade São Paulo',             'lat': -23.531359, 'lng': -46.664326},
    90:   {'text': 'Unidade Sorocaba',              'lat': -23.493852, 'lng': -47.466465}
  }
	
  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    
    const codUnidade = localStorage.getItem('codUnidade');
    
    for (const [unidade, data] of Object.entries(this.unidades)) {
      if (unidade == codUnidade ) { 
        this.unidade = data.text;
        this.lat = data.lat;
        this.lng = data.lng;
      }
    }

    
  }
  
  get nomeUnidade() { return this.unidade }

}
