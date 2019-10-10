import { Component, OnInit } from '@angular/core';
import { AutomaticsService } from '../../../../Servicios/automatics/automatics.service';
import { ActivatedRoute, Router} from '@angular/router';
import { Utilerias} from '../../../../Utilerias/Util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Automatics} from '../../../../Modelos/automatics/automatics';

@Component({
  selector: 'app-automatics',
  templateUrl: './automatics.component.html',
  styleUrls: ['./automatics.component.css']
})
export class AutomaticsComponent implements OnInit {

  private option: string = "";
  private automatic: FormGroup;
  private indeUniqueSelectedAutomatic = {};
  private indexSelectAutomaticModal: number = 0;

  constructor( private route: ActivatedRoute,
               private router: Router, private automaticService: AutomaticsService, private util: Utilerias, private formBuilder: FormBuilder) {
    this.route.parent.paramMap.subscribe(params => {
      this.automaticService.id_backup = params.get("idBack");
      this.automaticService.resetearVarables();
      this.buscarAutomatics();
    });
  }

  ngOnInit() {
  }

  private onScroll() {
    if (!this.automaticService.isFilter()) this.buscarAutomatics();
  }

  private buscarAutomatics() {
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

  private resultado(result) {
    if (this.automaticService.pagina == 0) { // Primera Busqueda
      this.util.detenerLoading();
      this.util.msj = result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.automaticService.Automatics = this.automaticService.Automatics.concat(result.automatics);
      this.util.QueryComplete.isComplete = false;
      this.AccountsAndCategoriesBackup(result);
      if (this.automaticService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.automatics.length < this.util.limit;
      }
      this.automaticService.pagina += 1;
    } else {
      this.util.QueryComplete.isComplete = this.automaticService.pagina != 0;
    }
    this.util.loadingMain = false;
  }

  public accionAutomatic(option, automatic = new Automatics(), i = null) {
    this.option = option;
    this.buildForm(automatic);
    if (this.option != this.util.AGREGAR) {
      this.indeUniqueSelectedAutomatic["id_backup"] = automatic.id_backup;
      this.indeUniqueSelectedAutomatic["id_operation"] = automatic.id_operation;
      this.indeUniqueSelectedAutomatic["id_account"] = automatic.id_account;
      this.indeUniqueSelectedAutomatic["id_category"] = automatic.id_category;
      this.automaticService.indexAutomaticSelected = i;
      if (this.automaticService.isFilter()) {
        this.automaticService.indexAutomaticSelected = <number>this.automaticService.Automatics.indexOf(automatic);
        this.automaticService.indexAutomaticFilterSelected = i;
      }
      this.automaticService.obtAccountsBackup();
    } else {
      this.getNewId_OperationAccountsCategories();
    }
  }

  private buildForm(automatic: Automatics) {
    this.automatic = this.formBuilder.group({
      id_backup : [automatic.id_backup, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("10"))]],
      id_operation : [automatic.id_operation, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("10"))]],
      id_account : [(this.option == this.util.AGREGAR) ? "": automatic.id_account, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("5"))]],
      id_category : [(this.option == this.util.AGREGAR) ? "": automatic.id_category, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("5"))]],
      period : [automatic.period, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("2"))]],
      repeat_number : [automatic.repeat_number, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("4"))]],
      each_number : [automatic.each_number, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("4"))]],
      enabled : [automatic.enabled, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("1"))]],
      amount : [(this.option == this.util.AGREGAR) ? automatic.amount: this.util.unZeroFile(automatic.amount), [Validators.required, Validators.min(0), Validators.pattern(this.util.exprRegular_6Decimal)]],
      sign : [automatic.sign, [Validators.required, Validators.maxLength(1)]],
      detail : [automatic.detail, [Validators.maxLength(100)]],
      initial_date : [(this.option == this.util.AGREGAR) ? new Date() : new Date(automatic.initial_date + " 00:00:00:00"), [Validators.required]],
      next_date : [(this.option == this.util.AGREGAR) ? new Date() : new Date(automatic.next_date + " 00:00:00:00"), [Validators.required]],
      operation_code : [(this.option == this.util.AGREGAR) ? this.util.randomOperation_Code() : automatic.operation_code, [Validators.required, Validators.minLength(15), Validators.maxLength(15), Validators.pattern(this.util.exprOperation_Code)]],
      rate : [(this.option == this.util.AGREGAR) ? automatic.rate: this.util.unZeroFile(automatic.rate), [Validators.required, Validators.min(0), Validators.pattern(this.util.exprRegular_6Decimal)]],
      counter : [automatic.counter, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("5"))]],
    });
    if (this.util.isDelete(this.option)) this.disableForm();
  }
  private getError(controlName: string): string {
    let error = '';
    const control = this.automatic.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      console.log("Error Control:=[" + controlName + "]", control.errors);
      error = this.util.hasError(control);
    }
    return error;
  }
  private disableForm() {
    for (let key in this.automatic.getRawValue()) {
      this.automatic.get(key).disable();
    }
    this.automatic.disable();
  }
  private closeModal() {
    this.util.cerrarModal("#modalAutomatic").then(() => {
      console.log("Modal cerrado :v");
      this.option = "";
      this.automatic = null;
    });
    //console.log("Value Form := ", this.automatic.value.next_date.toLocaleDateString());
  }
  private getNewId_OperationAccountsCategories() {
    this.util.msjLoading = "Calculando el nuevo id_operation para el operación automatica a agregar.";
    this.util.crearLoading().then(() => {
      this.automaticService.obtNewId_OperationAccountsCategories().subscribe(result => {
        this.util.detenerLoading();
        if (!result.error) {
          this.automatic.patchValue({id_operation: result.newId_Operation});
          this.AccountsAndCategoriesBackup(result);
          this.util.abrirModal("#modalAutomatic");
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  private AccountsAndCategoriesBackup(result) {
    if (!result.accountsBackup.error) {
      this.automaticService.AccountsBackup = result.accountsBackup.accounts;
      console.log("this.automaticService.AccountsBackup", this.automaticService.AccountsBackup);
    } else {
      this.util.msjToast(result.accountsBackup.msj, "", result.accountsBackup.error);
    }
  }

  private operation() {
    switch (this.option) {
      case this.util.AGREGAR:
        this.agregarAutomatic();
        break;
      case this.util.ACTUALIZAR:
        this.actualizarAutomatic();
        break;
      case this.util.ELIMINAR:
        this.eliminarAutomatic();
        break;
    }
  }
  private agregarAutomatic() {
    this.automatic.patchValue({id_backup: this.automaticService.id_backup});
    this.automatic.patchValue({initial_date: this.util.formatDateTimeSQL( this.automatic,"initial_date")});
    this.automatic.patchValue({next_date: this.util.formatDateTimeSQL( this.automatic,"next_date")});
    this.addZeroDecimalValue();
    this.util.msjLoading = "Agregando operación automática con Id_operation: " + this.automatic.value.id_operation + " del Respaldo Id_backup: " + this.automaticService.id_backup;
    this.util.crearLoading().then(() => {
      this.automaticService.agregarAutomatic(this.automatic.value).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
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
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  private actualizarAutomatic() {
    this.automatic.patchValue({initial_date: this.util.formatDateTimeSQL( this.automatic,"initial_date")});
    this.automatic.patchValue({next_date: this.util.formatDateTimeSQL( this.automatic,"next_date")});
    this.addZeroDecimalValue();
    this.util.msjLoading = "Actualizando operación automática con Id_operation: " + this.automatic.value.id_operation + " del Respaldo Id_backup: " + this.automaticService.id_backup;
    this.util.crearLoading().then(() => {
      this.automaticService.actualizarAutomatic(this.automatic.value, this.indeUniqueSelectedAutomatic).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          if (!result.automatic.error) {
            if (this.automaticService.isFilter()) {
              if (this.automaticService.indexAutomaticSelected != -1) this.automaticService.Automatics[this.automaticService.indexAutomaticSelected] = result.automatic.update;
              this.automaticService[this.automaticService.indexAutomaticFilterSelected] = result.automatic.update;
            } else {
              this.automaticService.Automatics[this.automaticService.indexAutomaticSelected] = result.automatic.update;
            }
          } else {
            this.util.msjToast(result.automatic.msj, this.util.errorRefreshListTable, result.automatic.error);
          }
          this.closeModal();
        }
        }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  private eliminarAutomatic() {
    this.util.msjLoading = "Eliminando operación automática con Id_operation: " + this.automatic.value.id_operation + " del Respaldo Id_backup: " + this.automaticService.id_backup;
    this.util.crearLoading().then(() => {
      this.automaticService.eliminarAutomatic(this.indeUniqueSelectedAutomatic).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
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
  private addZeroDecimalValue() {
    this.automatic.patchValue({amount: this.util.zeroFile(this.automatic.value.amount)});
    this.automatic.patchValue({rate: this.util.zeroFile(this.automatic.value.rate)});
    this.automatic.patchValue({sign: this.util.signValue(this.automatic.value.sign)});
  }
  private accountSelectedModal(event) {
    console.log("event:=", event.target.selectedIndex);
    console.log("event:=", this.automatic.value.id_account);
    this.indexSelectAutomaticModal = event.target.selectedIndex;
    this.automaticService.obtCategoriesAccountBackup(""+this.indexSelectAutomaticModal);
    this.automatic.patchValue({id_category: ''});
  }

}
