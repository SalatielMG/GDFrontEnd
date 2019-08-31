import { Component, OnInit } from '@angular/core';
import { PreferencesService } from '../../../../Servicios/preferences/preferences.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Utilerias} from '../../../../Utilerias/Util';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {
  public msj;

  constructor( private route: ActivatedRoute,
               private router: Router, private preferencesService: PreferencesService,  private util: Utilerias) {
    this.route.parent.paramMap.subscribe(params => {
      this.msj = 'Buscando Preferences relacionados con el backup';
      this.util.crearLoading().then(() => {
        this.preferencesService.buscarPreferencesBackup(params.get('idBack')).subscribe(result => {
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
      console.log('Valor de id Backup', params.get('idBack'));
      // this.idBack = params.get('idBack');
    });
  }

  ngOnInit() {
  }

}
