import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../../../Utilerias/Util';
import {PreferencesService} from '../../../../../Servicios/preferences/preferences.service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

  private pagina: number = 0;
  private backups;

  constructor(private route: ActivatedRoute,
              private router: Router, private preferencesService: PreferencesService, private util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      this.resetearVariables();
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla Preferences";
        return;
      }
      this.buscarInconsistencias();
    });
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
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Preferences';
      this.util.crearLoading().then(() => {
        this.preferencesService.inconsistenciaDatos(this.util.userMntInconsistencia, this.pagina, this.backups).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.preferencesService.inconsistenciaDatos(this.util.userMntInconsistencia, this.pagina, this.backups).subscribe(result => {
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
      this.util.msj =  result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.preferencesService.Preferences = this.preferencesService.Preferences.concat(result.preferences);
    }
    this.util.loadingMain = false;
  }

}
