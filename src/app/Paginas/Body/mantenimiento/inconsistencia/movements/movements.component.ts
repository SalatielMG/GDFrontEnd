import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../../../Utilerias/Util';
import {MovementsService} from '../../../../../Servicios/movements/movements.service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css']
})
export class MovementsComponent implements OnInit {

  public pagina: number = 0;
  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public movementsService: MovementsService, public util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      this.resetearVariables();
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla Movements";
        return;
      }
      this.buscarInconsistencias();
    });
  }

  ngOnInit() {
    this.util.ready();
  }
  public onScroll() {
    this.buscarInconsistencias();
  }
  public resetearVariables() {
    this.movementsService.Movements = [];
    this.pagina = 0;
  }
  public buscarInconsistencias() {
    this.util.loadingMain = true;
    if (this.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Movements';
      this.util.crearLoading().then(() => {
        this.movementsService.inconsistenciaDatos(this.util.userMntInconsistencia, this.pagina, this.backups).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.movementsService.inconsistenciaDatos(this.util.userMntInconsistencia, this.pagina, this.backups).subscribe(result => {
        this.resultado(result, false);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  public resultado(result, bnd =  true) {
    if (bnd) {
      this.util.detenerLoading();
      this.util.msjLoading = result.msj;
      this.util.msj = result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.movementsService.Movements = this.movementsService.Movements.concat(result.movements);
    }
    this.util.loadingMain = false;
  }

}
