import { Component, OnInit } from '@angular/core';
import { MovementsService } from '../../../../Servicios/movements/movements.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Utilerias} from '../../../../Utilerias/Util';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Movements} from '../../../../Modelos/movements/movements';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css']
})
export class MovementsComponent implements OnInit {

  private option: string = "";
  private movement: FormGroup = null;
  private indexUniqueMovementSelected = {};
  private indexMovementSelectModal: number = 0;

  constructor( private route: ActivatedRoute,
               private router: Router, private movementsService: MovementsService, private util: Utilerias, private formBuilder: FormBuilder) {
    this.route.parent.paramMap.subscribe(params => {
      this.movementsService.id_backup = parseInt(params.get("idBack"));
      this.movementsService.resetVariables();
      this.searchMovements();
    });
  }

  ngOnInit() {
  }
  private onScroll() {
    if (!this.movementsService.isFilter()) this.searchMovements();
  }

  private searchMovements() {
    this.util.loadingMain = true;
    if (this.movementsService.pagina == 0) {
      this.util.msjLoading = 'Buscando Movimientos del Respaldo con id_backup: ' + this.movementsService.id_backup;
      this.util.crearLoading().then(() => {
        this.movementsService.buscarMovementsBackup().subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.movementsService.buscarMovementsBackup().subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  private resultado(result) {
    this.util.msj =  result.msj;
    if (this.movementsService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.movementsService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.movements.length < this.util.limit;
        if (!result.accountsBackup.error) {
          this.movementsService.AccountsBackup = result.accountsBackup.accounts;
        } else {
          this.util.msjToast(result.accountsBackup.msj, "", result.accountsBackup.error);
        }
      }
      this.movementsService.pagina += 1;console.log("i:=", this.movementsService.pagina);
      this.movementsService.Movements = this.movementsService.Movements.concat(result.movements);
    } else {
      this.util.QueryComplete.isComplete = this.movementsService.pagina != 0;
    }
    this.util.loadingMain = false;
  }
  private acccionMovement(option, movement = new Movements(), i = null) {
    this.util.msjLoading = "Cagando cuentas del backup: " + this.movementsService.id_backup;
    this.util.crearLoading().then(() => {
      this.movementsService.accountsCategoriesServices.obtAccountsBackup(this.movementsService.id_backup, "1").subscribe(result => {
        if (!result.error) {
          this.option = option;
          this.buildForm(movement);
          if (this.option != this.util.AGREGAR) {
            this.indexUniqueMovementSelected["id_backup"] = movement.id_backup;
            this.indexUniqueMovementSelected["id_account"] = movement.id_account;
            this.indexUniqueMovementSelected["id_category"] = movement.id_category;
            this.indexUniqueMovementSelected["amount"] = movement.amount;
            this.indexUniqueMovementSelected["detail"] = movement.detail;
            this.indexUniqueMovementSelected["date_idx"] = movement.date_idx;
            this.movementsService.indexMovementSelected = i;
            if (this.movementsService.isFilter()) {
              this.movementsService.indexMovementSelected = <number> this.movementsService.Movements.indexOf(movement);
              this.movementsService.indexMovementFilterSelected = i;
            }
            this.movementsService.AccountsBackup.forEach((a, index) => {
              if (a.id_account.toString() == movement.id_account.toString()){
                this.indexMovementSelectModal = index + 1;
              }
            });
          }
          setTimeout(() => {
            this.util.detenerLoading();
            this.util.abrirModal("#modalMovement");
          }, this.util.timeOutMilliseconds);
        } else {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error);
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }

  private buildForm(movement: Movements) {
    this.movement = this.formBuilder.group({
      id_backup : [movement.id_backup],
      id_account : [movement.id_account],
      id_category : [movement.id_category],
      amount : [movement.amount],
      sign : [movement.sign],
      detail : [movement.detail],
      date_record : [movement.date_record],
      time_record : [movement.time_record],
      confirmed : [movement.confirmed],
      transfer : [movement.transfer],
      date_idx : [movement.date_idx],
      day : [movement.day],
      week : [movement.week],
      fortnight : [movement.fortnight],
      month : [movement.month],
      year : [movement.year],
      operation_code : [movement.operation_code],
      picture : [movement.picture],
      iso_code : [movement.iso_code],
    });
  }
}
