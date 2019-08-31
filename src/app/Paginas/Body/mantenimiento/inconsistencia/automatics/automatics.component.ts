import { Component, OnInit } from '@angular/core';
import {AutomaticsService} from "../../../../../Servicios/automatics/automatics.service";
import {Utilerias} from "../../../../../Utilerias/Util";
@Component({
  selector: 'app-automatics',
  templateUrl: './automatics.component.html',
  styleUrls: ['./automatics.component.css']
})
export class AutomaticsComponent implements OnInit {

  public msj;

  constructor(private automaticsService: AutomaticsService, private util: Utilerias) {
    this.msj = 'Buscando inconsistencia de datos en la tabla Automatics';
    this.util.crearLoading().then(() => {
      this.automaticsService.buscarInconsistenciaDatos().subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          this.automaticsService.Automatics = result.automatics;
        }
      }, error => {
        this.util.detenerLoading();
        this.util.msjErrorInterno(error);
      });
    });
  }

  ngOnInit() {
  }

}
