import { Component, OnInit } from '@angular/core';
import { MovementsService } from '../../../../Servicios/movements/movements.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Utilerias} from '../../../../Utilerias/Util';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  //private paginaAnt = 0;
  private onScroll(event) {
    console.log("Event:=", event);
    if (!this.movementsService.isFilter() && !this.util.loadingMain) {
      this.searchMovements();
      console.log("Scrolled [Pagina]:=", this.movementsService.pagina);
    }
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
      id_backup : [movement.id_backup, [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("10")), Validators.min(0)]],
      id_account : [(this.option == this.util.AGREGAR) ? "" :movement.id_account, [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("5")), Validators.min(0)]],
      id_category : [(this.option == this.util.AGREGAR) ? "" :movement.id_category, [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("5")), Validators.min(0)]],
      amount : [(this.option == this.util.AGREGAR) ? movement.amount : this.util.unZeroFile(movement.amount), [Validators.required, Validators.min(0), Validators.pattern(this.util.exprRegular_6Decimal)]],
      sign : [movement.sign, [Validators.required, Validators.maxLength(1)]],
      detail : [movement.detail, [Validators.maxLength(200)]],
      date_record : [(this.option == this.util.AGREGAR) ? new Date() : new Date(movement.date_record + " 00:00:00"), [Validators.required]],
      time_record : [(this.option == this.util.AGREGAR) ? new Date() : new Date(movement.date_record + " " + movement.time_record), [Validators.required]],
      confirmed : [this.util.valueChecked(movement.confirmed), [Validators.required]],
      transfer : [this.util.valueChecked(movement.transfer), [Validators.required]],
      date_idx : [movement.date_idx, [Validators.required, Validators.maxLength(15), Validators.minLength(15)]],
      day : [movement.day, [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("2")), Validators.min(0)]],
      week : [movement.week, [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("2")), Validators.min(0)]],
      fortnight : [movement.fortnight, [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("2")), Validators.min(0)]],
      month : [{value: (this.option == this.util.AGREGAR) ? "" : movement.month, disabled: true}, [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("2")), Validators.min(0)]],
      year : [movement.year, [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("4")), Validators.min(0)]],
      operation_code : [movement.operation_code, [Validators.maxLength(15)]],
      picture : [movement.picture, [Validators.maxLength(100)]],
      iso_code : [movement.iso_code, [Validators.required, Validators.maxLength(3)]],
    });
    if (this.util.isDelete(this.option)) this.disableForm();

  }
  private getError(controlName: string): string {
    let error = '';
    const control = this.movement.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      console.log("Error Control:=[" + controlName + "]", control.errors);
      error = this.util.hasError(control);
    }
    return error;
  }
  private disableForm() {
    for (let key in this.movement.getRawValue()) {
      this.movement.get(key).disable();
    }
    this.movement.disable();
  }
  private closeModal() {
    this.util.cerrarModal("#modalMovement").then(() => {
      console.log("Modal cerrado :v");
      this.option = "";
      this.movement = null;
    });
  }
  private changeEvent(event) {
    this.movement.patchValue({id_category: ''});
    console.log("event changeradioBtutton:= ", event);
    console.log("Value movement:=", this.movement.value);
  }
  private operation() {
    console.log("Value movement:=", this.movement.value);
  }
  private accountSelectedModal(event) {
    this.indexMovementSelectModal = event.target.selectedIndex;
    this.movement.patchValue({id_category: ''});
    console.log("event:=", event.target.selectedIndex);
    console.log("event:=", this.movement.value.id_account);

    if (this.movement.value.id_account == "") return;
    this.movementsService.obtCategoriesAccountBackup(this.indexMovementSelectModal.toString());
  }
  private changeDateTime(event, isDate) {
    console.log("event changeDateTime:=", event);
    console.log("movement changeDateTime:=", this.movement.value);
    console.log("isDate changeDateTime:=", isDate);
    console.log("date_record changeDateTime:=", this.movement.value.date_record.toLocaleDateString());
    console.log("time_record changeDateTime:=", this.movement.value.time_record.toLocaleTimeString());
    if (isDate) { // Extact Date
      if (this.movement.value.date_record != null) {
        let date = this.util.formatDateTimeSQL(this.movement, "date_record", false).split("-");
        this.movement.patchValue({day: date[2]});
        this.movement.patchValue({month: date[1]});
        this.movement.patchValue({year: date[0]});
        this.movement.patchValue({fortnight: this.util.getBiweekNumber(date)});
        this.movement.patchValue({week: this.util.getWeekNumber(this.movement.value.date_record)});

        console.log("date", date);
      }
    } else { //Extac Time
      if (this.movement.value.time_record != null) {
        let time = this.movement.value.time_record.toLocaleTimeString().split(":");
        console.log("time", time.toString());
      }
    }
  }
}
