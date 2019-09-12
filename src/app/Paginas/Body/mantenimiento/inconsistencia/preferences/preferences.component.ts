import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../../../Utilerias/Util';
import {PreferencesService} from '../../../../../Servicios/preferences/preferences.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

  public msj;
  private pagina: number = 0;

  constructor(private preferencesService: PreferencesService, private util: Utilerias) {
    this.resetearVariables();
    this.buscarInconsistencias();
  }

  ngOnInit() {
    this.util.ready();
  }

  onScroll() {
    this.buscarInconsistencias();
  }

  private resetearVariables() {
    this.preferencesService.Preferences = [];
    this.pagina = 0;
  }

  private buscarInconsistencias(){
    this.util.loadingMain = true;
    if (this.pagina == 0) {
      this.msj = 'Buscando inconsistencia de datos en la tabla Preferences';
      this.util.crearLoading().then(() => {
        this.preferencesService.inconsistenciaDatos(this.util.emailUserMntInconsistencia, this.pagina).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.preferencesService.inconsistenciaDatos(this.util.emailUserMntInconsistencia, this.pagina).subscribe(result => {
        this.resultado(result, false);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }

  private resultado(result, bnd = true) {
    if (bnd) {
      this.util.detenerLoading();
      this.msj =  result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.preferencesService.Preferences = this.preferencesService.Preferences.concat(result.preferences);
    }
    this.util.loadingMain = false;
  }

}
