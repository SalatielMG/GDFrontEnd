import { Component } from '@angular/core';
import {AutomaticsService} from "../../../../../Servicios/automatics/automatics.service";
import {Utilerias} from "../../../../../Utilerias/Util";
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  selector: 'app-automatics',
  templateUrl: './automatics.component.html',
  styleUrls: ['./automatics.component.css']
})
export class AutomaticsComponent {

  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public automaticsService: AutomaticsService, public util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla Automatics";
        return;
      }
      this.automaticsService.resetearVarables();
      this.buscarInconsistencia();
    });

  }
  public onScroll() {
    if (!this.automaticsService.isFilter() && !this.util.loadingMain) this.buscarInconsistencia();
  }
  public buscarInconsistencia() {
    this.util.loadingMain = true;
    if (this.automaticsService.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Automatics';
      this.util.crearLoading().then(() => {
        this.automaticsService.buscarInconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.automaticsService.buscarInconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }

  public resultado(result) {
    this.util.msj = result.msj;
    if (this.automaticsService.pagina == 0) { // Primera Busqueda
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.automaticsService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.automatics.length < this.util.limit;
      }
      this.automaticsService.pagina += 1;
      this.automaticsService.Automatics = this.automaticsService.Automatics.concat(result.automatics);
    } else {
      this.util.QueryComplete.isComplete = this.automaticsService.pagina != 0;
    }
    this.util.loadingMain = false;
  }

}
