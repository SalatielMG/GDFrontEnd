import { Component, OnInit } from '@angular/core';
import {AutomaticsService} from "../../../../../Servicios/automatics/automatics.service";
import {Utilerias} from "../../../../../Utilerias/Util";
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  selector: 'app-automatics',
  templateUrl: './automatics.component.html',
  styleUrls: ['./automatics.component.css']
})
export class AutomaticsComponent implements OnInit {

  public pagina: number = 0;
  public backups;
  public msj: string = "";

  constructor(public route: ActivatedRoute,
              public router: Router, public automaticsService: AutomaticsService, public util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      this.resetearVariable();
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla Automatics";
        return;
      }
      this.buscarInconsistencia();
    });

  }

  ngOnInit() {
    this.util.ready();
  }
  onScroll () {
    console.log('scrolled!!');
    this.buscarInconsistencia();
  }
  public resetearVariable() {
    this.automaticsService.Automatics = [];
    this.pagina = 0;
  }

  public buscarInconsistencia() {
    this.util.loadingMain = true;
    if(this.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Automatics';
      this.util.crearLoading().then(() => {
        this.automaticsService.buscarInconsistenciaDatos(this.util.userMntInconsistencia, this.pagina,  this.backups).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.automaticsService.buscarInconsistenciaDatos(this.util.userMntInconsistencia, this.pagina,  this.backups).subscribe(result => {
        this.resultado(result, false);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }

  public resultado(result, bnd = true) {
    if (bnd) {
      this.util.detenerLoading();
      this.util.msjLoading =  result.msj;
      this.util.msj =  result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.automaticsService.Automatics = this.automaticsService.Automatics.concat(result.automatics);
    }
    this.util.loadingMain = false;
  }

}
