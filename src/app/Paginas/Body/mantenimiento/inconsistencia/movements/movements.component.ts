import { Component } from '@angular/core';
import {Utilerias} from '../../../../../Utilerias/Util';
import {MovementsService} from '../../../../../Servicios/movements/movements.service';
import {ActivatedRoute, Router} from "@angular/router";
import {Movements} from '../../../../../Modelos/movements/movements';
import {UsuarioService} from '../../../../../Servicios/usuario/usuario.service';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css']
})
export class MovementsComponent {

  public movementSelected: any = new Movements();
  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public movementsService: MovementsService, public util: Utilerias, private usuarioService: UsuarioService) {
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
  public onScroll(event) {
    if (!this.util.loadingMain) {
      this.buscarInconsistencias();
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
        this.util.QueryComplete.isComplete = result.movements.length < this.util.limit_Inconsistencia;
      }
      this.movementsService.pagina += 1;
      this.movementsService.Movements = this.movementsService.Movements.concat(result.movements);
    } else {
      this.util.QueryComplete.isComplete = true;
    }
    this.util.loadingMain = false;
  }
  public accionCorregirRegistro(movement: Movements, index) {
    this.movementsService.indexMovementSelected = index;
    this.movementSelected = movement;
    this.util.abrirModal("#modalMovement");
  }
  public corregirInconsistenciaRegistro() {
    let movement: any = {};
    movement["id_backup"] = this.movementSelected.id_backup;
    movement["id_account"] = this.movementSelected.id_account;
    movement["id_category"] = this.movementSelected.id_category;
    movement["amount"] = this.movementSelected.amount;
    movement["detail"] = this.movementSelected.detail;
    movement["date_idx"] = this.movementSelected.date_idx;
    this.util.msjLoading = "Corrigiengo inconsistencia de datos del registro Movement con " + this.util.key_Names(movement);
    this.util.crearLoading().then(() => {
      this.movementsService.corregirInconsistenciaRegistro(movement, this.usuarioService.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          if (!result.movement.error) {
            this.movementsService.Movements[this.movementsService.indexMovementSelected] = result.movement.movements[0];
          } else {
            this.movementsService.Movements[this.movementsService.indexMovementSelected]["repeated"] = 1;
          }
          this.util.cerrarModal("#modalMovement");
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
}
