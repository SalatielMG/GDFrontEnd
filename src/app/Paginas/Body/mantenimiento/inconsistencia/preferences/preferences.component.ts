import { Component } from '@angular/core';
import {Utilerias} from '../../../../../Utilerias/Util';
import {PreferencesService} from '../../../../../Servicios/preferences/preferences.service';
import {ActivatedRoute, Router} from "@angular/router";
import {Preferences} from '../../../../../Modelos/preferences/preferences';
import {UsuarioService} from '../../../../../Servicios/usuario/usuario.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent {

  public preferenceSelected: Preferences = new Preferences();
  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public preferencesService: PreferencesService, public util: Utilerias, private usuarioService: UsuarioService) {
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
    if (!this.util.loadingMain) {
      this.buscarInconsistencias();
    }
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
        this.util.QueryComplete.isComplete = result.preferences.length < this.util.limit_Inconsistencia;

      }
      this.preferencesService.pagina += 1;
      this.preferencesService.Preferences = this.preferencesService.Preferences.concat(result.preferences);
    } else {
      this.util.QueryComplete.isComplete = true;
    }
    this.util.loadingMain = false;
  }
  public accionCorregirRegistro(preference: Preferences, index) {
    this.preferencesService.indexPreferenceSelected = index;
    this.preferenceSelected = preference;
    this.util.abrirModal("#modalPreference");
  }
  public corregirInconsistenciaRegistro() {
    let preference: any = {};
    preference["id_backup"] = this.preferenceSelected.id_backup;
    preference["key_name"] = this.preferenceSelected.key_name;
    this.util.msjLoading = "Corrigiengo inconsistencia de datos de la Preferencia con " + this.util.key_Names(preference);
    this.util.crearLoading().then(() => {
      this.preferencesService.corregirInconsistenciaRegistro(preference, this.usuarioService.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          if (!result.preference.error) {
            this.preferencesService.Preferences[this.preferencesService.indexPreferenceSelected] = result.preference.preferences[0];
          } else {
            this.preferencesService.Preferences[this.preferencesService.indexPreferenceSelected]["repeated"] = 1;
          }
          this.util.cerrarModal("#modalPreference");
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
}
