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

  constructor(private preferencesService: PreferencesService, private util: Utilerias) {
    this.msj = 'Buscando inconsistencia de datos en la tabla Preferences';
    this.util.crearLoading().then(() => {
      this.preferencesService.inconsistenciaDatos(this.util.emailUserMntInconsistencia).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          this.preferencesService.Preferences = result.preferences;
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
