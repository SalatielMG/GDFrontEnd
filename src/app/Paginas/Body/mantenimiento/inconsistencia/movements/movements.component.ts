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
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla Movements";
        return;
      }
      this.movementsService.resetVariables();
      this.buscarInconsistencias();
    });
  }

  ngOnInit() {
    this.util.ready();
  }
  public onScroll(event) {
    console.log("Event:=", event);
    if (!this.movementsService.isFilter() && !this.util.loadingMain) {
      this.buscarInconsistencias();
      console.log("Scrolled [Pagina]:=", this.movementsService.pagina);
    }
  }
  public buscarInconsistencias() {
    this.util.loadingMain = true;
    if (this.movementsService.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Movements';
      this.util.crearLoading().then(() => {
        this.movementsService.inconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.movementsService.inconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  public resultado(result) {
    this.util.msj =  result.msj;
    if (this.movementsService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.movementsService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.movements.length < this.util.limit;
      }
      this.movementsService.pagina += 1;console.log("i:=", this.movementsService.pagina);
      this.movementsService.Movements = this.movementsService.Movements.concat(result.movements);
    } else {
      this.util.QueryComplete.isComplete = this.movementsService.pagina != 0;
    }
    this.util.loadingMain = false;
  }

}
