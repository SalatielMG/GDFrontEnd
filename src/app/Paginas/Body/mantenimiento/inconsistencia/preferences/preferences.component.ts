import { Component } from '@angular/core';
import {Utilerias} from '../../../../../Utilerias/Util';
import {PreferencesService} from '../../../../../Servicios/preferences/preferences.service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent {

  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public preferencesService: PreferencesService, public util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      this.preferencesService.resetVariables();
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla Preferences";
        return;
      }
      this.buscarInconsistencias();
    });
  }

  onScroll() {
    this.buscarInconsistencias();
  }

  public buscarInconsistencias(){
    this.util.loadingMain = true;
    if (this.preferencesService.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Preferences';
      this.util.crearLoading().then(() => {
        this.preferencesService.inconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.preferencesService.inconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }

  public resultado(result) {
    this.util.msj = result.msj;
    if (this.preferencesService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.preferencesService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.preferences.length < this.util.limit;

      }
      this.preferencesService.pagina += 1;
      this.preferencesService.Preferences = this.preferencesService.Preferences.concat(result.preferences);
    } else {
      this.util.QueryComplete.isComplete = this.preferencesService.pagina != 0;
    }
    this.util.loadingMain = false;
  }

}
