import { Component } from '@angular/core';
import { AutomaticsService } from '../../../../Servicios/automatics/automatics.service';
import { ActivatedRoute, Router} from '@angular/router';
import { Utilerias} from '../../../../Utilerias/Util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Automatics} from '../../../../Modelos/automatics/automatics';
import {UsuarioService} from '../../../../Servicios/usuario/usuario.service';

@Component({
  selector: 'app-automatics',
  templateUrl: './automatics.component.html',
  styleUrls: ['./automatics.component.css']
})
export class AutomaticsComponent {

  public option: string = "";
  public automatic: FormGroup = null;
  public indexUniqueSelectedAutomatic = {};
  public indexSelectAutomaticModal: number = 0;

  constructor(public usuarioServicio: UsuarioService, public route: ActivatedRoute,
               public router: Router, public automaticService: AutomaticsService, public util: Utilerias, public formBuilder: FormBuilder) {
    this.route.parent.paramMap.subscribe(params => {
      this.automaticService.id_backup = params.get("idBack");
      this.automaticService.resetearVarables();
      this.buscarAutomatics();
    });
  }

  public onScroll() {
    if (!this.util.QueryComplete.isComplete && !this.automaticService.isFilter() && !this.util.loadingMain) this.buscarAutomatics();
  }

  public buscarAutomatics() {
    this.util.loadingMain = true;
    if (this.automaticService.pagina == 0) {
      this.util.msjLoading = "Buscando registros en la tabla Automatics del backup : " + this.automaticService.id_backup;
      this.util.crearLoading().then(() => {
        this.automaticService.buscarAutomaticsBackup().subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.automaticService.buscarAutomaticsBackup().subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }

  public resultado(result) {
    this.util.msj = result.msj;
    if (this.automaticService.pagina == 0) { // Primera Busqueda
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.automaticService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.automatics.length < this.util.limit;
        this.AccountsAndCategoriesBackup(result);
      }
      this.automaticService.pagina += 1;
      this.automaticService.Automatics = this.automaticService.Automatics.concat(result.automatics);
    } else {
      this.util.QueryComplete.isComplete = true;
    }
    this.util.loadingMain = false;
  }

  public accionAutomatic(option, automatic = new Automatics(), i = null) {
      this.option = option;

      if (this.option != this.util.OPERACION_AGREGAR) {
        this.util.msjLoading = "Cargando cuentas y categorias del backup: " + this.automaticService.id_backup;
        this.util.crearLoading().then(() => {
          this.automaticService.obtAccountsBackup().then((error => {
            //this.util.detenerLoading();
            if (!error && error != 400) {
              this.buildForm(automatic);
              this.automaticService.AccountsBackup.forEach((a, index) => {
                if (a.id_account.toString() == automatic.id_account.toString()) {
                  this.indexSelectAutomaticModal = index + 1; return;
                }
              });
              this.indexUniqueSelectedAutomatic["id_backup"] = automatic.id_backup;
              this.indexUniqueSelectedAutomatic["id_operation"] = automatic.id_operation;
              this.indexUniqueSelectedAutomatic["id_account"] = automatic.id_account;
              this.indexUniqueSelectedAutomatic["id_category"] = automatic.id_category;
              this.indexUniqueSelectedAutomatic["period"] = automatic.period;
              this.indexUniqueSelectedAutomatic["repeat_number"] = automatic.repeat_number;
              this.indexUniqueSelectedAutomatic["each_number"] = automatic.each_number;
              this.indexUniqueSelectedAutomatic["amount"] = automatic.amount;
              this.indexUniqueSelectedAutomatic["sign"] = this.util.signValue(automatic.sign);
              this.indexUniqueSelectedAutomatic["detail"] = automatic.detail;
              this.indexUniqueSelectedAutomatic["initial_date"] = automatic.initial_date;
              this.automaticService.indexAutomaticSelected = i;
              if (this.automaticService.isFilter()) {
                this.automaticService.indexAutomaticSelected = <number>this.automaticService.Automatics.indexOf(automatic);
                this.automaticService.indexAutomaticFilterSelected = i;
              }
              setTimeout(()=> {
                this.util.detenerLoading();
                this.util.abrirModal("#modalAutomatic");
              }, this.util.timeOutMilliseconds);
            } else {
              this.util.msjToast((error == 400) ? "Ocurrio un error interno del servidor": "No se encontraron registros de cuentas y categorias asociadas con el id_backup: " + this.automaticService.id_backup, "¡ -- ERROR -- !", (error == 400) ? "warning": true);

            }
          }));
        });
      } else {
        this.util.msjLoading = "Calculando el nuevo id_operation para el operación automatica a agregar.";
        this.util.crearLoading().then(() => {
          this.automaticService.obtNewId_OperationAccountsCategories().subscribe(result => {
            if (!result.error) {
              this.option = option;
              this.buildForm(automatic);

              this.automatic.patchValue({id_operation: result.newId_Operation});
              this.AccountsAndCategoriesBackup(result);
              setTimeout(()=> {
                this.util.detenerLoading();
                this.util.abrirModal("#modalAutomatic");
              }, this.util.timeOutMilliseconds);
            } else this.util.detenerLoading();
          }, error => {
            this.util.msjErrorInterno(error);
          });
        });
      }

  }
  public buildForm(automatic: Automatics) {
    this.automatic = this.formBuilder.group({
      id_backup : [automatic.id_backup, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("10"))]],
      id_operation : [automatic.id_operation, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("10"))]],
      id_account : [(this.option == this.util.OPERACION_AGREGAR) ? "": automatic.id_account, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("5"))]],
      id_category : [(this.option == this.util.OPERACION_AGREGAR) ? "": automatic.id_category, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("5"))]],
      period : [automatic.period, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("2"))]],
      repeat_number : [automatic.repeat_number, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("4"))]],
      each_number : [automatic.each_number, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("4"))]],
      enabled : [this.util.valueChecked(automatic.enabled), [Validators.required]],
      amount : [(this.option == this.util.OPERACION_AGREGAR) ? automatic.amount: this.util.unZeroFile(automatic.amount), [Validators.required, Validators.min(0), Validators.pattern(this.util.exprRegular_6Decimal)]],
      sign : [automatic.sign, [Validators.required, Validators.maxLength(1)]],
      detail : [automatic.detail, [Validators.maxLength(100)]],
      initial_date : [(this.option == this.util.OPERACION_AGREGAR) ? new Date() : new Date(automatic.initial_date + " 00:00:00:00"), [Validators.required]],
      next_date : [(this.option == this.util.OPERACION_AGREGAR) ? new Date() : new Date(automatic.next_date + " 00:00:00:00"), [Validators.required]],
      operation_code : [(this.option == this.util.OPERACION_AGREGAR) ? this.util.randomOperation_Code() : automatic.operation_code, [Validators.required, Validators.minLength(15), Validators.maxLength(15), Validators.pattern(this.util.exprOperation_Code)]],
      rate : [(this.option == this.util.OPERACION_AGREGAR) ? automatic.rate: this.util.unZeroFile(automatic.rate), [Validators.required, Validators.min(0), Validators.pattern(this.util.exprRegular_6Decimal)]],
      counter : [automatic.counter, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("5"))]],
    });
    if (this.util.isDelete(this.option)) this.disableForm();
  }
  public getError(controlName: string): string {
    let error = '';
    const control = this.automatic.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      error = this.util.hasError(control);
    }
    return error;
  }
  public disableForm() {
    for (let key in this.automatic.getRawValue()) {
      this.automatic.get(key).disable();
    }
    this.automatic.disable();
  }
  public closeModal() {
    this.util.cerrarModal("#modalAutomatic").then(() => {
      this.option = "";
      this.automatic = null;
    });
  }
  public operation() {
    switch (this.option) {
      case this.util.OPERACION_AGREGAR:
        this.agregarAutomatic();
        break;
      case this.util.OPERACION_ACTUALIZAR:
        this.actualizarAutomatic();
        break;
      case this.util.OPERACION_ELIMINAR:
        this.eliminarAutomatic();
        break;
    }
  }
  public agregarAutomatic() {
    this.patchValueFormDataDate();
    this.util.msjLoading = "Agregando operación automática con Id_operation: " + this.automatic.value.id_operation + " del Respaldo Id_backup: " + this.automaticService.id_backup;
    this.util.crearLoading().then(() => {
      this.automaticService.agregarAutomatic(this.automatic.value, this.usuarioServicio.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (this.util.QueryComplete.isComplete) {
            if (!result.automatic.error) {
              this.automaticService.Automatics.push(result.automatic.new);
              if (this.automaticService.isFilter()) this.automaticService.proccessFilter();
            } else {
              this.util.msjToast(result.automatic.msj, this.util.errorRefreshListTable, result.automatic.error);
            }
          }
          this.closeModal();
        } else {
          this.patchValueAfterError();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  public actualizarAutomatic() {
    this.patchValueFormDataDate();
    this.util.msjLoading = "Actualizando operación automática con Id_operation: " + this.automatic.value.id_operation + " del Respaldo Id_backup: " + this.automaticService.id_backup;
    this.util.crearLoading().then(() => {
      this.automaticService.actualizarAutomatic(this.automatic.value, this.indexUniqueSelectedAutomatic, this.usuarioServicio.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (!result.automatic.error) {
            if (this.automaticService.isFilter()) {
              if (this.automaticService.indexAutomaticSelected != -1) this.automaticService.Automatics[this.automaticService.indexAutomaticSelected] = result.automatic.update;
              this.automaticService.indexAutomaticFilterSelected[this.automaticService.indexAutomaticFilterSelected] = result.automatic.update;
            } else {
              this.automaticService.Automatics[this.automaticService.indexAutomaticSelected] = result.automatic.update;
            }
          } else {
            this.util.msjToast(result.automatic.msj, this.util.errorRefreshListTable, result.automatic.error);
          }
          this.closeModal();
        } else {
          this.patchValueAfterError();
        }
        }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  public eliminarAutomatic() {
    this.util.msjLoading = "Eliminando operación automática con Id_operation: " + this.automatic.value.id_operation + " del Respaldo Id_backup: " + this.automaticService.id_backup;
    this.util.crearLoading().then(() => {
      this.automaticService.eliminarAutomatic(this.indexUniqueSelectedAutomatic, this.usuarioServicio.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (this.automaticService.isFilter()) {
            if (this.automaticService.indexAutomaticSelected != -1) this.automaticService.Automatics.splice(this.automaticService.indexAutomaticSelected, 1);
            this.automaticService.automaticsFilter.splice(this.automaticService.indexAutomaticFilterSelected, 1);
          } else {
            this.automaticService.Automatics.splice(this.automaticService.indexAutomaticSelected, 1);
          }
          this.closeModal();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }

  public accountSelectedModal(event) {
    this.indexSelectAutomaticModal = event.target.selectedIndex;
    this.automatic.patchValue({id_category: ''});
    if (this.automatic.value.id_account == "") return;
    this.automaticService.obtCategoriesAccountBackup(this.indexSelectAutomaticModal.toString());
  }
  public AccountsAndCategoriesBackup(result) {
    if (!result.accountsBackup.error) {
      this.automaticService.AccountsBackup = result.accountsBackup.accounts;
    } else {
      this.util.msjToast(result.accountsBackup.msj, "", result.accountsBackup.error);
    }
  }
  public patchValueFormDataDate() {
    this.automatic.patchValue({id_backup: this.automaticService.id_backup});
    this.automatic.patchValue({initial_date: this.util.formatDateTimeSQL( this.automatic,"initial_date", false)});
    this.automatic.patchValue({next_date: this.util.formatDateTimeSQL( this.automatic,"next_date", false)});
    this.automatic.patchValue({amount: this.util.zeroFile(this.automatic.value.amount)});
    this.automatic.patchValue({rate: this.util.zeroFile(this.automatic.value.rate)});
    this.automatic.patchValue({sign: this.util.signValue(this.automatic.value.sign)});
    this.automatic.patchValue({enabled: this.util.unValueChecked(this.automatic.value.enabled)});
  }
  public patchValueAfterError() {
    this.automatic.patchValue({initial_date: this.util.formatComponentDateCalendar( this.automatic.value.initial_date)});
    this.automatic.patchValue({next_date: this.util.formatComponentDateCalendar( this.automatic.value.next_date)});
    this.automatic.patchValue({sign: this.util.signUnvalue(this.automatic.value.sign)});
    this.automatic.patchValue({enabled: this.util.valueChecked(this.automatic.value.enabled)});
  }
}
