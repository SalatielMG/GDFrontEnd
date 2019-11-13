import { Component, OnInit } from '@angular/core';
import {ExtrasService} from '../../../../../Servicios/extras/extras.service';
import {Utilerias} from '../../../../../Utilerias/Util';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.css']
})
export class ExtrasComponent implements OnInit {

  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public extrasService: ExtrasService, public util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla Extras";
        return;
      }
      this.extrasService.resetVariables();
      this.buscarInconsistencia();
    });
  }

  ngOnInit() {
    this.util.ready();
  }
  public onScroll() {
    if (this.extrasService.isFilter() && !this.util.loadingMain) {
      this.buscarInconsistencia();
    }
  }
  public buscarInconsistencia() {
    this.util.loadingMain = true;
    if (this.extrasService.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Extras';
      this.util.crearLoading().then(() => {
        this.extrasService.inconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
          this.resultado(result)
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.extrasService.inconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
        this.resultado(result)
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  public resultado(result, bnd = true) {
    this.util.msj = result.msj;
    if (this.extrasService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.extrasService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.extras.length < this.util.limit;
      }
      this.extrasService.pagina += 1;
      this.extrasService.Extras = this.extrasService.Extras.concat(result.extras);
    } else {
      this.util.QueryComplete.isComplete = this.extrasService.pagina != 0;
    }
    this.util.loadingMain = false;
  }

}
