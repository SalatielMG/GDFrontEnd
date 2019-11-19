import { Component } from '@angular/core';
import {AutomaticsService} from "../../../../../Servicios/automatics/automatics.service";
import {Utilerias} from "../../../../../Utilerias/Util";
import {ActivatedRoute, Router} from "@angular/router";
import {Automatics} from '../../../../../Modelos/automatics/automatics';
import {UsuarioService} from '../../../../../Servicios/usuario/usuario.service';
@Component({
  selector: 'app-automatics',
  templateUrl: './automatics.component.html',
  styleUrls: ['./automatics.component.css']
})
export class AutomaticsComponent {

  public automaticSelected: Automatics = new Automatics();
  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public automaticsService: AutomaticsService, public util: Utilerias, private usuarioService: UsuarioService) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla Automatics";
        return;
      }
      this.automaticsService.resetearVarables();
      this.buscarInconsistencia();
    });

  }
  public onScroll() {
    if (!this.util.loadingMain) this.buscarInconsistencia();
  }
  public buscarInconsistencia() {
    this.util.loadingMain = true;
    if (this.automaticsService.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Automatics';
      this.util.crearLoading().then(() => {
        this.automaticsService.buscarInconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.automaticsService.buscarInconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }

  public resultado(result) {
    this.util.msj = result.msj;
    if (this.automaticsService.pagina == 0) { // Primera Busqueda
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.automaticsService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.automatics.length < this.util.limit_Inconsistencia;
      }
      this.automaticsService.pagina += 1;
      this.automaticsService.Automatics = this.automaticsService.Automatics.concat(result.automatics);
    } else {
      this.util.QueryComplete.isComplete = true;
    }
    this.util.loadingMain = false;
  }
  public accionCorreirRegistro(automatic: Automatics, index) {
    this.automaticsService.indexAutomaticSelected = index;
    this.automaticSelected = automatic;
    this.util.abrirModal("#modalAutomatic");
  }
  public corregirInconsistenciaRegistro() {
    let automatic: any = {};
    automatic["id_backup"] = this.automaticSelected.id_backup;
    automatic["id_operation"] = this.automaticSelected.id_operation;
    automatic["id_account"] = this.automaticSelected.id_account;
    automatic["id_category"] = this.automaticSelected.id_category;
    automatic["period"] = this.automaticSelected.period;
    automatic["repeat_number"] = this.automaticSelected.repeat_number;
    automatic["each_number"] = this.automaticSelected.each_number;
    automatic["amount"] = this.automaticSelected.amount;
    automatic["sign"] = this.automaticSelected.sign;
    automatic["detail"] = this.automaticSelected.detail;
    automatic["initial_date"] = this.automaticSelected.initial_date;
    this.util.msjLoading = "Corrigiendo inconsistencias del registro Automatic con id_backup: " + automatic.id_backup + ", id_operation: " + automatic.id_operation;
    this.util.crearLoading().then(() => {
      this.automaticsService.corregirInconsistenciaRegistro(automatic, this.usuarioService.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          if (!result.automatic.error) {
            this.automaticsService.Automatics[this.automaticsService.indexAutomaticSelected] = result.automatic.automatics[0];
          } else {
            this.automaticsService.Automatics[this.automaticsService.indexAutomaticSelected]["repeated"] = 1;
          }
          this.util.cerrarModal("#modalAutomatic");
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }

}
