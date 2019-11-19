import { Component } from '@angular/core';
import { MovementsService } from '../../../../Servicios/movements/movements.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Utilerias} from '../../../../Utilerias/Util';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Movements} from '../../../../Modelos/movements/movements';
import {UsuarioService} from '../../../../Servicios/usuario/usuario.service';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css']
})
export class MovementsComponent {

  public option: string = "";
  public movement: FormGroup = null;
  public indexUniqueMovementSelected = {};
  public indexMovementSelectModal: number = 0;

  constructor(public usuarioServicio: UsuarioService, public route: ActivatedRoute,
               public router: Router, public movementsService: MovementsService, public util: Utilerias, public formBuilder: FormBuilder) {
    this.route.parent.paramMap.subscribe(params => {
      this.movementsService.id_backup = parseInt(params.get("idBack"));
      this.movementsService.resetVariables();
      this.searchMovements();
    });
  }

  public onScroll(event) {
    if (!this.util.QueryComplete.isComplete && !this.movementsService.isFilter() && !this.util.loadingMain) {
      this.searchMovements();
    }
  }

  public searchMovements() {
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
  public resultado(result) {
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
      this.movementsService.pagina += 1;
      this.movementsService.Movements = this.movementsService.Movements.concat(result.movements);
    } else {
      this.util.QueryComplete.isComplete = true;
    }
    this.util.loadingMain = false;
  }
  public acccionMovement(option, movement = new Movements(), i = null) {
    this.util.msjLoading = "Cagando cuentas del backup: " + this.movementsService.id_backup;
    this.util.crearLoading().then(() => {
      this.movementsService.accountsCategoriesServices.obtAccountsBackup(this.movementsService.id_backup, "1").subscribe(result => {
        if (!result.error) {
          this.movementsService.AccountsBackup = result.accounts;
          this.option = option;
          this.buildForm(movement);
          if (this.option != this.util.OPERACION_AGREGAR) {
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

  public buildForm(movement: Movements) {
    this.movement = this.formBuilder.group({
      id_backup : [movement.id_backup, [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("10")), Validators.min(0)]],
      id_account : [(this.option == this.util.OPERACION_AGREGAR) ? "" :movement.id_account, [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("5")), Validators.min(0)]],
      id_category : [(this.option == this.util.OPERACION_AGREGAR) ? "" :movement.id_category, [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("5")), Validators.min(0)]],
      amount : [(this.option == this.util.OPERACION_AGREGAR) ? movement.amount : this.util.unZeroFile(movement.amount), [Validators.required, Validators.min(0), Validators.pattern(this.util.exprRegular_6Decimal)]],
      sign : [movement.sign, [Validators.required, Validators.maxLength(1)]],
      detail : [movement.detail, [Validators.maxLength(200)]],
      date_record : [(this.option == this.util.OPERACION_AGREGAR) ? new Date() : new Date(movement.date_record + " 00:00:00"), [Validators.required]],
      time_record : [(this.option == this.util.OPERACION_AGREGAR) ? new Date() : new Date(movement.date_record + " " + movement.time_record), [Validators.required]],
      confirmed : [this.util.valueChecked(movement.confirmed), [Validators.required]],
      transfer : [this.util.valueChecked(movement.transfer), [Validators.required]],
      date_idx : [movement.date_idx, [Validators.required, Validators.minLength(14)]],
      day : [movement.day, [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("2")), Validators.min(0)]],
      week : [movement.week, [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("2")), Validators.min(0)]],
      fortnight : [movement.fortnight, [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("2")), Validators.min(0)]],
      month : [(this.option == this.util.OPERACION_AGREGAR) ? "" : ((movement.month.toString().length == 1) ? "0" + movement.month : movement.month), [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("2")), Validators.min(0)]],
      year : [movement.year, [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("4")), Validators.min(0)]],
      operation_code : [movement.operation_code, [Validators.maxLength(15)]],
      picture : [movement.picture, [Validators.maxLength(100)]],
      iso_code : [movement.iso_code, [Validators.required, Validators.maxLength(3)]],
    });
    if (this.util.isDelete(this.option)) this.disableForm(); else if (this.option == this.util.OPERACION_AGREGAR){
      this.setValueDateRecord();
      this.setValueTimeRecord();
    }
  }
  public getError(controlName: string): string {
    let error = '';
    const control = this.movement.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      error = this.util.hasError(control);
    }
    return error;
  }
  public disableForm() {
    for (let key in this.movement.getRawValue()) {
      this.movement.get(key).disable();
    }
    this.movement.disable();
  }
  public closeModal() {
    this.util.cerrarModal("#modalMovement").then(() => {
      this.option = "";
      this.movement = null;
    });
  }
  public changeEvent(event) {
    this.movement.patchValue({id_category: ''});
  }
    public accountSelectedModal(event) {
    this.indexMovementSelectModal = event.target.selectedIndex;
    this.movement.patchValue({id_category: ''});
    this.movement.patchValue({iso_code: ((this.movement.value.id_account == "") ? "" : this.movementsService.AccountsBackup[this.util.numberFormat(this.indexMovementSelectModal) - 1].iso_code)});

    if (this.movement.value.id_account == "") return;
    this.movementsService.obtCategoriesAccountBackup(this.indexMovementSelectModal.toString());
  }
  public changeDateTime(event, isDate) {
    if (isDate) { // Extact Date
      this.setValueDateRecord();
    } else { //Extac Time
      this.setValueTimeRecord();
    }
  }
  public setValueDateRecord() {
    if (this.movement.value.date_record != null) {
      let date = this.util.formatDateTimeSQL(this.movement, "date_record", false).split("-");
      this.movement.patchValue({day: date[2]});
      this.movement.patchValue({month: date[1]});
      this.movement.patchValue({year: date[0]});
      this.movement.patchValue({fortnight: this.util.getBiweekNumber(date)});
      this.movement.patchValue({week: this.util.getWeekNumber(this.movement.value.date_record)});
      if (this.movement.value.time_record != null) {
        let time = this.movement.value.time_record.toLocaleTimeString().split(":");
        time.forEach((value, index) => {
          time[index] = (value.length == 1) ? "0" + value : value;
        });
        this.movement.patchValue({date_idx: date.toString().replace(/,/g,"") + time.toString().replace(/,/g,"")});
      } else {
        this.movement.patchValue({date_idx: date.toString().replace(/,/g,"") + "000000"});
      }

    }
  }
  public setValueTimeRecord() {
    if (this.movement.value.time_record != null) {
      let time = this.movement.value.time_record.toLocaleTimeString().split(":");
      time.forEach((value, index) => {
        time[index] = (value.length == 1) ? "0" + value : value;
      });
      this.movement.patchValue({date_idx: ((this.movement.value.date_record != null) ? this.util.formatDateTimeSQL(this.movement, "date_record", false).split("-").toString().replace(/,/g,""): "00000000") + time.toString().replace(/,/g,"")});

    }
  }

  public operation() {
    switch (this.option) {
      case this.util.OPERACION_AGREGAR:
        this.agregarMovement();
        break;
      case this.util.OPERACION_ACTUALIZAR:
        this.actualizarMovement();
        break;
      case this.util.OPERACION_ELIMINAR:
        this.eliminarMovement();
        break;
    }
  }
  public agregarMovement () {
    this.patchValueFormDataBeforeOperation();
    this.util.msjLoading = "Agregando Movimiento " + ((this.movement.value.sign) ? "Ingreso": "Gasto") + " del Respaldo con id_backup: " + this.movementsService.id_backup;
    this.util.crearLoading().then(() => {
      this.movementsService.agregarMovement(this.movement.value, this.usuarioServicio.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (this.util.QueryComplete.isComplete) {
            if (!result.movement.error) {
              this.movementsService.Movements.push(result.movement.new);
              if (this.movementsService.isFilter()) this.movementsService.proccessFilter();
            } else {
              this.util.msjToast(result.movement.msj, this.util.errorRefreshListTable, result.movement.error);
            }
          }
          this.closeModal();
        } else {
          this.patchValueFormDataAfterOperationError();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  public actualizarMovement () {
    this.patchValueFormDataBeforeOperation();
    this.util.msjLoading = "Actualizado Movimiento " + ((this.movement.value.sign) ? "Ingreso": "Gasto") + " del Respaldo con id_backup: " + this.movementsService.id_backup;
    this.util.crearLoading().then(() => {
      this.movementsService.actualizarMovement(this.movement.value, this.indexUniqueMovementSelected, this.usuarioServicio.usuarioCurrent.id).subscribe(result => {
         this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (!result.movement.error) {
            if (this.movementsService.isFilter()) {
              if (this.movementsService.indexMovementSelected != -1) this.movementsService.Movements[this.movementsService.indexMovementSelected] = result.movement.update;
              this.movementsService.movementsFilter[this.movementsService.indexMovementFilterSelected] = result.movement.update;
            } else {
              this.movementsService.Movements[this.movementsService.indexMovementSelected] = result.movement.update;
            }
          } else {
            this.util.msjToast(result.movement.msj, this.util.errorRefreshListTable, result.movement.error);
          }
          this.closeModal();
        } else {
          this.patchValueFormDataAfterOperationError();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  public eliminarMovement () {
    this.util.msjLoading = "Eliminando Movimiento " + ((this.movement.value.sign) ? "Ingreso": "Gasto") + " del Respaldo con id_backup: " + this.movementsService.id_backup;
    this.util.crearLoading().then(() => {
      this.movementsService.eliminarMovement(this.indexUniqueMovementSelected, this.usuarioServicio.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (this.movementsService.isFilter()) {
            if (this.movementsService.indexMovementSelected != -1) this.movementsService.Movements.splice(this.movementsService.indexMovementSelected, 1);
            this.movementsService.movementsFilter.splice(this.movementsService.indexMovementFilterSelected, 1);
          } else {
            this.movementsService.Movements.splice(this.movementsService.indexMovementSelected, 1);
          }
          this.closeModal();
        } else {
          this.patchValueFormDataAfterOperationError();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  public patchValueFormDataBeforeOperation () {
    this.movement.patchValue({id_backup: this.movementsService.id_backup});
    this.movement.patchValue({amount: this.util.zeroFile(this.movement.value.amount)});
    this.movement.patchValue({sign: this.util.signValue(this.movement.value.sign)});
    this.movement.patchValue({date_record: this.util.formatDateTimeSQL(this.movement, "date_record", false)});
    this.movement.patchValue({time_record: this.util.formatTimeSQL(this.movement.value.time_record.toLocaleTimeString())});
    this.movement.patchValue({confirmed: this.util.unValueChecked(this.movement.value.confirmed)});
    this.movement.patchValue({transfer: this.util.unValueChecked(this.movement.value.transfer)});

  }
  public patchValueFormDataAfterOperationError () {
    this.movement.patchValue({sign: this.util.signUnvalue(this.movement.value.sign)});
    this.movement.patchValue({time_record: this.util.formatComponentTime(this.movement.value.date_record, this.movement.value.time_record)});
    this.movement.patchValue({date_record: this.util.formatComponentDateCalendar(this.movement.value.date_record)});
    this.movement.patchValue({confirmed: this.util.valueChecked(this.movement.value.confirmed)});
    this.movement.patchValue({transfer: this.util.valueChecked(this.movement.value.transfer)});
  }
}
