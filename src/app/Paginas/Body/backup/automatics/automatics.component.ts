import { Component, OnInit } from '@angular/core';
import { AutomaticsService } from '../../../../Servicios/automatics/automatics.service';
import { ActivatedRoute, Router} from '@angular/router';
import { Utilerias} from '../../../../Utilerias/Util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Automatics} from '../../../../Modelos/automatics/automatics';
import {Categories} from '../../../../Modelos/categories/categories';
import {Accounts} from '../../../../Modelos/accounts/accounts';

@Component({
  selector: 'app-automatics',
  templateUrl: './automatics.component.html',
  styleUrls: ['./automatics.component.css']
})
export class AutomaticsComponent implements OnInit {

  private option: string = "";
  private automatic: FormGroup;
  private id_backup;
  private AccountsBackup: Accounts[] = [];
  private CategoriesBackup: Categories[] = [];

  constructor( private route: ActivatedRoute,
               private router: Router, private automaticService: AutomaticsService, private util: Utilerias, private formBuilder: FormBuilder) {
    this.route.parent.paramMap.subscribe(params => {
      this.id_backup = params.get("idBack");
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
      this.util.msjLoading = "Buscando registros en la tabla Automatics del backup : " + this.id_backup;
      this.util.crearLoading().then(() => {
        this.automaticService.buscarAutomaticsBackup(this.id_backup).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.automaticService.buscarAutomaticsBackup(this.id_backup).subscribe(result => {
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
      this.automaticService.pagina += 1;
      this.automaticService.Automatics = this.automaticService.Automatics.concat(result.automatics);
      this.util.QueryComplete.isComplete = false;
      this.AccountsAndCategoriesBackup(result);
      // console.log("Accounts", this.accountService.Accounts);
    } else {
      this.util.QueryComplete.isComplete = this.automaticService.pagina != 0;
    }
    this.util.loadingMain = false;
  }

  public accionAutomatic(option, automatic = new Automatics(), i = null) {
    console.log("Automatic seleccionada", automatic);
    this.option = option;
    this.buildForm(automatic);
    if (this.option != this.util.AGREGAR) {
      this.automaticService.indexAutomaticSelected = i;
      if (this.automaticService.isFilter()) {
        this.automaticService.indexAutomaticSelected = <number>this.automaticService.Automatics.indexOf(automatic);
        this.automaticService.indexAutomaticFilterSelected = i;
      }
    } else {
      //console.log("account before method getNewId_Account()", this.automatic);
      this.getNewId_OperationAccountsCategories();
    }
  }

  private buildForm(automatic: Automatics) {
    this.automatic = this.formBuilder.group({
      id_backup : [automatic.id_backup, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("10"))]],
      id_operation : [automatic.id_operation, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("10"))]],
      id_account : [automatic.id_account, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("5"))]],
      id_category : [automatic.id_category, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("5"))]],
      period : [automatic.period, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("2"))]],
      repeat_number : [automatic.repeat_number, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("4"))]],
      each_number : [automatic.each_number, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("4"))]],
      enabled : [automatic.enabled, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("1"))]],
      amount : [(this.option == this.util.AGREGAR) ? automatic.amount: this.util.unZeroFile(automatic.amount), [Validators.required, Validators.min(0)], Validators.pattern(this.util.exprRegular_6Decimal)],
      sign : [automatic.sign, [Validators.required, Validators.maxLength(1)]],
      detail : [automatic.detail, [Validators.maxLength(100)]],
      initial_date : [automatic.initial_date, [Validators.required]],
      next_date : [automatic.next_date, [Validators.required]],
      operation_code : [automatic.operation_code, [Validators.required, Validators.maxLength(15)]],
      rate : [(this.option == this.util.AGREGAR) ? automatic.rate: this.util.unZeroFile(automatic.rate), [Validators.required, Validators.min(0)], Validators.pattern(this.util.exprRegular_6Decimal)],
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
  }
  private getNewId_OperationAccountsCategories() {
    this.util.msjLoading = "Calculando el nuevo id_operation para el configuración automatica a agregar.";
    this.util.crearLoading().then(() => {
      this.automaticService.obtNewId_OperationAccountsCategories(this.id_backup).subscribe(result => {
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
      this.AccountsBackup = result.accountsBackup.accounts;
    } else {
      this.util.msjToast(result.accountsBackup.msj, "", result.accountsBackup.error);
    }
    if (!result.categoriesBackup.error) {
      this.CategoriesBackup = result.categoriesBackup.categories;
    } else {
      this.util.msjToast(result.categoriesBackup.msj, "", result.categoriesBackup.error);
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
    this.automatic.patchValue({id_backup: this.id_backup});
    this.addZeroDecimalValue();
    this.util.msjLoading = "Agregando configuración automática con Id_operation: " + this.automatic.value.id_operation + " del Respaldo Id_backup: " + this.id_backup;
    this.util.crearLoading().then(() => {

    });
  }
  private actualizarAutomatic() {
    this.addZeroDecimalValue();
    this.util.msjLoading = "Actualizando configuración automática con Id_operation: " + this.automatic.value.id_operation + " del Respaldo Id_backup: " + this.id_backup;
    this.util.crearLoading().then(() => {

    });
  }
  private eliminarAutomatic() {
    this.util.msjLoading = "Eliminando configuración automática con Id_operation: " + this.automatic.value.id_operation + " del Respaldo Id_backup: " + this.id_backup;
    this.util.crearLoading().then(() => {

    });
  }
  private addZeroDecimalValue() {
    this.automatic.patchValue({amount: this.util.zeroFile(this.automatic.value.amount)});
    this.automatic.patchValue({rate: this.util.zeroFile(this.automatic.value.rate)});
    this.automatic.patchValue({sign: this.util.signValue(this.automatic.value.sign)});
  }

}
