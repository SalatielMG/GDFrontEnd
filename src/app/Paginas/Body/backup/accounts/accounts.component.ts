import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '../../../../Servicios/accounts/accounts.service';
import { Utilerias } from '../../../../Utilerias/Util';
import {Accounts} from "../../../../Modelos/accounts/accounts";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  public option: string = "";
  public account: FormGroup = null;
  public indexUniqueAccountSelected = {};
  public currencySelected = "";

  constructor( public route: ActivatedRoute,
               public router: Router, public accountService: AccountsService, public util: Utilerias, public formBuilder: FormBuilder) {
    this.route.parent.paramMap.subscribe(params => {
      this.accountService.id_backup = parseInt(params.get("idBack"));
      this.accountService.resetearVariables();
      this.buscarAccounts();
    });
  }
  public onScroll() {
    if (!this.accountService.isFilter() && !this.util.loadingMain) this.buscarAccounts();
  }

  public buscarAccounts() {
    this.util.loadingMain = true;
    if (this.accountService.pagina == 0) {
      this.util.msjLoading = "Buscando registros en la tabla Accounts del backup : " + this.accountService.id_backup;
      this.util.crearLoading().then(() => {
        this.accountService.buscarAccountsBackup().subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.accountService.buscarAccountsBackup().subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  public resultado(result) {
    this.util.msj = result.msj;
    if (this.accountService.pagina == 0) { // Primera Busqueda
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.accountService.CurrenciesSelected = result.currenciesSelected;
      this.accountService.CurrenciesGralBackup = result.currencies;
      this.util.QueryComplete.isComplete = false;
      if (this.accountService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.accounts.length < this.util.limit;
        if (!result.accountsBackup.error) {
          this.accountService.AccountsBackup = result.accountsBackup.accounts;
        } else {
          this.util.msjToast(result.accountsBackup.msj, "", result.accountsBackup.error);
        }
      }
      this.accountService.pagina += 1;
      this.accountService.Accounts = this.accountService.Accounts.concat(result.accounts);
    } else {
      this.util.QueryComplete.isComplete = this.accountService.pagina != 0;
    }
    this.util.loadingMain = false;
  }

  ngOnInit() {
  }


  public accionAccount(option, account = new Accounts(), i = null) {
    this.util.msjLoading = "Cargando currencies del backup: " + this.accountService.id_backup;
    this.util.crearLoading().then(() => {
      this.accountService.buscarCurrenciesAccountBackup().subscribe(result => {
        if (!result.error) {
          this.accountService.CurrenciesSelected = result.currenciesSelected;
          this.accountService.CurrenciesGralBackup = result.currencies;
          this.option = option;
          this.buildForm(account);
          if (this.option != this.util.AGREGAR) {
            this.indexUniqueAccountSelected["id_backup"] = account.id_backup;
            this.indexUniqueAccountSelected["id_account"] = account.id_account;
            this.indexUniqueAccountSelected["name"] = account.name;
            this.accountService.indexAccountSelected = i;
            if (this.accountService.isFilter()) {
              this.accountService.indexAccountSelected = <number>this.accountService.Accounts.indexOf(account);
              this.accountService.indexAccountFilterSelected = i;
            }
            setTimeout(()=> {
              this.util.detenerLoading();
              this.util.abrirModal("#modalAccount");
            }, this.util.timeOutMilliseconds);
          } else {
            this.util.detenerLoading();
            this.getNewId_Account();
          }
        } else {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error);
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });

  }
  public getNewId_Account() {
    console.log("account value:", this.account);
      this.util.msjLoading = "Calculando el id_account para la nueva cuenta a agregar";
      this.util.crearLoading().then(() => {
        this.accountService.obtNewId_account().subscribe(result => {
          this.util.detenerLoading();
          if (!result.error) {
            console.log("account value:", this.account);
            this.account.patchValue({id_account: result.newId_account});
            this.util.abrirModal("#modalAccount");
          } else {
            this.util.msjToast(result.msj, result.titulo, result.error);
          }
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
  }
  public buildForm(account) {
    this.account = this.formBuilder.group({
      id_backup : [account.id_backup, Validators.required],
      id_account : [account.id_account, Validators.required],
      name : [account.name, [Validators.required, Validators.maxLength(50)]],
      detail : [account.detail, [Validators.maxLength(100)]],
      sign : [account.sign, [Validators.required, Validators.maxLength(1)]],
      income : [(this.option == this.util.AGREGAR) ? account.income : this.util.unZeroFile(account.income), [Validators.required, Validators.min(0), Validators.pattern(this.util.exprRegular_6Decimal)]],
      expense : [(this.option == this.util.AGREGAR) ? account.expense : this.util.unZeroFile(account.expense), [Validators.required, Validators.min(0), Validators.pattern(this.util.exprRegular_6Decimal)]],
      initial_balance : [(this.option == this.util.AGREGAR) ? account.initial_balance : this.util.unZeroFile(account.initial_balance), [Validators.required, Validators.min(0), Validators.pattern(this.util.exprRegular_6Decimal)]],
      final_balance : [(this.option == this.util.AGREGAR) ? account.final_balance : this.util.unZeroFile(account.final_balance), [Validators.required, Validators.min(0), Validators.pattern(this.util.exprRegular_6Decimal)]],
      month : [account.month, [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("2"))]],
      year : [account.year, [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("4"))]],
      positive_limit : [account.positive_limit, [Validators.required,  Validators.pattern(this.util.reegex_MaxLengthNumber("1"))]],
      negative_limit : [account.negative_limit, [Validators.required,  Validators.pattern(this.util.reegex_MaxLengthNumber("1"))]],
      positive_max : [(this.option == this.util.AGREGAR) ? account.positive_max : this.util.unZeroFile(account.positive_max), Validators.compose([Validators.required, Validators.min(0), Validators.pattern(this.util.exprRegular_6Decimal)])],
      negative_max : [(this.option == this.util.AGREGAR) ? account.negative_max : this.util.unZeroFile(account.negative_max), Validators.compose([Validators.required, Validators.min(0), Validators.pattern(this.util.exprRegular_6Decimal)])],
      iso_code : [(this.option == this.util.AGREGAR)? ((this.accountService.CurrenciesSelected.length > 0) ? this.accountService.CurrenciesSelected[0].iso_code : ""): account.iso_code, [Validators.required, Validators.maxLength(3)]],
      selected : [this.util.valueChecked(account.selected),  [Validators.required]],
      value_type : [account.value_type,  [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("1"))]],
      include_total : [account.include_total,  Validators.compose([Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("1"))])],
      rate : [(this.option == this.util.AGREGAR) ? account.rate : this.util.unZeroFile(account.rate), [Validators.required, Validators.pattern(this.util.exprRegular_6Decimal)]],
      icon_name : [account.icon_name,  [Validators.maxLength(20)]],
    });
    if (this.util.isDelete(this.option)) this.disable();
    console.log("account after method buildForm()", this.account);
  }
  public getError(controlName: string): string {
    let error = '';
    const control = this.account.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      console.log("Error Control:=[" + controlName + "]", control.errors);
      error = this.util.hasError(control);
    }
    return error;
  }

  public disable() {
    for (let key in this.account.getRawValue()) {
        this.account.get(key).disable();
    }
    this.account.disable();
  }
  public closeModal() {
    this.util.cerrarModal("#modalAccount").then(() => {
      console.log("Modal cerrado :v");
      this.option = "";
      this.account = null;
    });
  }
  public operacion() {
    switch (this.option) {
      case this.util.AGREGAR:
        this.agregarAccount();
        break;
      case this.util.ACTUALIZAR:
        this.actualizarAccount();
        break;
      case this.util.ELIMINAR:
        this.eliminarAccount();
        break;
    }
    console.log("value in Account FormGroup:=", this.account.value);
  }
  public agregarAccount() {
    this.patchValueFormDataBeforeOperation();
    this.util.msjLoading = "Agregando cuenta Id_account: " + this.account.value.id_account + " del Respaldo Id_backup: " + this.accountService.id_backup;
    this.util.crearLoading().then(()=> {
      this.accountService.agregarAccount(this.account.value).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) { // Success insert new account
          /*
          * El nuevo account se agrega al arreglo original si esta completa la consulta y se filtran la busqueda nuevamente si esta activada.
          * */
          if (this.util.QueryComplete.isComplete || this.accountService.Accounts.length == 0) {
            if (!result.account.error) { // Se recibio correctamente la consulta de la nueva cuenta creada.
              this.accountService.Accounts.push(result.account.new);
              if (this.accountService.isFilter()) {
                // Volver a realizar el filtro de las busquedas
                this.accountService.proccessFilter();
              }
            } else {
              this.util.msjToast(result.account.msj, this.util.errorRefreshListTable, result.account.error);
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
  public actualizarAccount() {
    this.patchValueFormDataBeforeOperation();
    this.util.msjLoading = "Actualizando cuenta Id_account: " + this.account.value.id_account + " del Respaldo Id_backup: " + this.accountService.id_backup;
    this.util.crearLoading().then(() => {
      this.accountService.actualizarAccount(this.account.value, this.indexUniqueAccountSelected).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (!result.account.error) {
            if (this.accountService.isFilter()) {
              if (this.accountService.indexAccountSelected != -1) this.accountService.Accounts[this.accountService.indexAccountSelected] = result.account.update;
              this.accountService.accountsFilter[this.accountService.indexAccountFilterSelected] = result.account.update;
            } else {
              this.accountService.Accounts[this.accountService.indexAccountSelected] = result.account.update;
            }
          } else {
            this.util.msjToast(result.account.msj, this.util.errorRefreshListTable, result.account.error);
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
  public eliminarAccount() {
    this.util.msjLoading = "Eliminando cuenta Id_account: " + this.account.value.id_account + " del Respaldo Id_backup: " + this.accountService.id_backup;
    this.util.crearLoading().then(() => {
      this.accountService.eliminarAccount(this.indexUniqueAccountSelected).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) { // splice in the original array account and filterAccount if isFilter()
          if (this.accountService.isFilter()) {
            if (this.accountService.indexAccountSelected != -1) this.accountService.Accounts.splice(this.accountService.indexAccountSelected, 1);
            this.accountService.accountsFilter.splice(this.accountService.indexAccountFilterSelected, 1);
          } else {
            this.accountService.Accounts.splice(this.accountService.indexAccountSelected, 1);
          }
          this.closeModal();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  public patchValueFormDataBeforeOperation () {
    this.account.patchValue({id_backup: this.accountService.id_backup});
    this.account.patchValue({income: this.util.zeroFile(this.account.value.income)});
    this.account.patchValue({expense: this.util.zeroFile(this.account.value.expense)});
    this.account.patchValue({initial_balance: this.util.zeroFile(this.account.value.initial_balance)});
    this.account.patchValue({final_balance: this.util.zeroFile(this.account.value.final_balance)});
    this.account.patchValue({positive_max: this.util.zeroFile(this.account.value.positive_max)});
    this.account.patchValue({negative_max: this.util.zeroFile(this.account.value.negative_max)});
    this.account.patchValue({rate: this.util.zeroFile(this.account.value.rate)});
    this.account.patchValue({sign: this.util.signValue(this.account.value.sign)});
    this.account.patchValue({selected: this.util.unValueChecked(this.account.value.selected)});
    console.log("Value this.accout after addZeroFile:=", this.account.value);
  }
  public patchValueFormDataAfterOperationError () {
    this.account.patchValue({sign: this.util.signUnvalue(this.account.value.sign)});
    this.account.patchValue({selected: this.util.valueChecked(this.account.value.selected)});
  }
}
