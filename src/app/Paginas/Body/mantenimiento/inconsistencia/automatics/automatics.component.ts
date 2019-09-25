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

  private pagina: number = 0;
  private backups;

  constructor(private route: ActivatedRoute,
              private router: Router, private automaticsService: AutomaticsService, private util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      console.log(this.backups);
      console.log("params", params);
      this.resetearVariable();
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
  private resetearVariable() {
    this.automaticsService.Automatics = [];
    this.pagina = 0;
  }

  private buscarInconsistencia() {
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

  private resultado(result, bnd = true) {
    if (bnd) {
      this.util.detenerLoading();
      this.util.msjLoading =  result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.automaticsService.Automatics = this.automaticsService.Automatics.concat(result.automatics);
    }
    this.util.loadingMain = false;
  }

}
