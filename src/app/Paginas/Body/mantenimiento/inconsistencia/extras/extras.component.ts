import { Component } from '@angular/core';
import {ExtrasService} from '../../../../../Servicios/extras/extras.service';
import {Utilerias} from '../../../../../Utilerias/Util';
import {ActivatedRoute, Router} from "@angular/router";
import {Extras} from '../../../../../Modelos/extras/extras';
import {UsuarioService} from '../../../../../Servicios/usuario/usuario.service';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.css']
})
export class ExtrasComponent {

  public extraSelected: any = new Extras();
  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public extrasService: ExtrasService, public util: Utilerias, private usuarioService: UsuarioService) {
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

  public onScroll() {
    if (!this.util.loadingMain) {
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
  public resultado(result) {
    this.util.msj = result.msj;
    if (this.extrasService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.extrasService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.extras.length < this.util.limit_Inconsistencia;
      }
      this.extrasService.pagina += 1;
      this.extrasService.Extras = this.extrasService.Extras.concat(result.extras);
    } else {
      this.util.QueryComplete.isComplete = true;
    }
    this.util.loadingMain = false;
  }
  public accionCorregirRegistro (extra: Extras, index) {
    this.extrasService.indexExtraSelected = index;
    this.extraSelected = extra;
    this.util.abrirModal("#modalExtra");
  }
  public corregirInconsistenciaRegistro () {
    let extra: any ={};
    extra["id_backup"] = this.extraSelected.id_backup;
    extra["id_extra"] = this.extraSelected.id_extra;
    this.util.msjLoading = "Corrigiendo inconsistencia del registro Extra con " + this.util.key_Names(extra);
    this.util.crearLoading().then(() => {
      this.extrasService.corregirInconsistenciaRegistro(extra, this.usuarioService.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          if (!result.extra.error) {
            this.extrasService.Extras[this.extrasService.indexExtraSelected] = result.extra.extras[0];
          } else {
            this.extrasService.Extras[this.extrasService.indexExtraSelected]["repeated"] = 1;
          }
          this.util.cerrarModal("#modalExtra");
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }

}
