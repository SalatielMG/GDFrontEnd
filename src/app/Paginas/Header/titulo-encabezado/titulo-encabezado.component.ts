import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-titulo-encabezado',
  templateUrl: './titulo-encabezado.component.html',
  styleUrls: ['./titulo-encabezado.component.css']
})
export class TituloEncabezadoComponent implements OnInit {
  @Input() titulo;
  @Input() subTitulo = '';
  constructor() { }

  ngOnInit() {
  }

}

