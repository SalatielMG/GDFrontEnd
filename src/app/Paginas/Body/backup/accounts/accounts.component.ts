import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '../../../../Servicios/accounts/accounts.service';
import { Utilerias } from '../../../../Utilerias/Util';
import {Accounts} from "../../../../Modelos/accounts/accounts";
import {FiltersSearchAccounts} from "../../../../Modelos/accounts/filters-search-accounts";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  private option: string = "";
  private pagina: number = 0;
  private id_backup;
  private filtersSearch = new FiltersSearchAccounts();
  private accountsFilter: Accounts[] = [];

  private account: FormGroup;
  private indexAccountSelected: number = 0;
  private indexAccountFilterSelected: number = 0;

  constructor( private route: ActivatedRoute,
               private router: Router, private accountService: AccountsService, private util: Utilerias, private formBuilder: FormBuilder) {
    this.route.parent.paramMap.subscribe(params => {
      this.id_backup = params.get("idBack");
      this.resetearVariables();
      this.buscarAccounts();
    });
  }
  private onScroll() {
    if (!this.isFilter()) this.buscarAccounts();
  }
  private resetearVariables() {
    this.accountService.Accounts = [];
    this.pagina = 0;
  }
  private buscarAccounts() {
    this.util.loadingMain = true;
    if (this.pagina == 0) {
      this.util.msjLoading = "Buscando registros en la tabla Accounts del backup : " + this.id_backup;
      this.util.crearLoading().then(() => {
        this.accountService.buscarAccountsBackup(this.id_backup, this.pagina).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.accountService.buscarAccountsBackup(this.id_backup, this.pagina).subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  private resultado(result) {
    if (this.pagina == 0) { // Primera Busqueda
      this.util.detenerLoading();
      this.util.msj = result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.accountService.Accounts = this.accountService.Accounts.concat(result.accounts);
      this.util.QueryComplete.isComplete = false;
      // console.log("Accounts", this.accountService.Accounts);
    } else {
      this.util.QueryComplete.isComplete = this.pagina != 0;
    }
    this.util.loadingMain = false;
  }

  ngOnInit() {
  }

  // -------------------------------------------------- Filter Seacrh --------------------------------------------------
  private actionFilterEvent(event, value, isKeyUp = false) {
    if (value == "selected") {
      if (this.filtersSearch[value].value == "-1") {
        this.filtersSearch[value].isFilter = false;
        this.filtersSearch[value].valueAnt = this.filtersSearch[value].value;
        this.proccessFilter();
        return;
      }
    } else {
      if (isKeyUp && event.key != "Enter") return;
      if (this.filtersSearch[value].value == "") return;
    }
    if (this.filtersSearch[value].value == this.filtersSearch[value].valueAnt) return;
    this.resetFilterisActive();
    this.filtersSearch[value].isFilter = true;
    this.filtersSearch[value].valueAnt = this.filtersSearch[value].value;
    this.proccessFilter();
  }
  private resetValuefiltroSearch(key) {
    this.filtersSearch[key].value =  "";
    this.filtersSearch[key].valueAnt =  "";
    this.filtersSearch[key].isFilter =  false;
    if (key == "selected") this.filtersSearch[key].value = "-1";

    if (!this.isFilter()) {
      this.accountsFilter = [];
      return;
    }
    this.proccessFilter();
  }
  private resetFilterisActive() {
    if (!this.isFilter()) {
      this.accountsFilter = [];
      this.accountsFilter =  this.accountsFilter.concat(this.accountService.Accounts);
    }
  }
  private proccessFilter() {
    let temp = [];
    this.accountService.Accounts.forEach((account) => {

      let bnd = true;
      for (let k in this.filtersSearch) {
        if (this.filtersSearch[k].isFilter) {
          if (k == "selected" && this.filtersSearch[k].value != "-1") {
            if (account[k].toString() != this.filtersSearch[k].value) {
              bnd = false;
              break;
            }
          } else {
            if (!account[k].toString().includes(this.filtersSearch[k].value)) {
              bnd = false;
              break;
            }
          }
        }
      }

      if (bnd) {
        temp.push(account);
      }

    });
    this.accountsFilter = [];
    this.accountsFilter = this.accountsFilter.concat(temp);
    temp = null;
  }
  private isFilter(): boolean {
    for (let key in this.filtersSearch)
      if (this.filtersSearch[key].isFilter) return true;
    return false
  }
  // -------------------------------------------------- Filter Seacrh --------------------------------------------------

  public accionAccount(option, account = new Accounts(), i = null) {
    console.log("Cuenta seleccionada", account);
    this.option = option;
    this.buildForm(account).then(() => {
      if (this.option != this.util.AGREGAR) {
        this.indexAccountSelected = i;
        if (this.isFilter()) {
          this.indexAccountSelected = <number>this.accountService.Accounts.indexOf(account);
          this.indexAccountFilterSelected = i;
        }
      } else {
        console.log("account before method getNewId_Account()", this.account);
        this.getNewId_Account();
      }
    });
  }
  private getNewId_Account() {
    console.log("account value:", this.account);
      this.util.msjLoading = "Calculando el nuevo id_account para la cuenta a agregar";
      this.util.crearLoading().then(() => {
        this.accountService.obtNewId_account(this.id_backup).subscribe(result => {
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
  private buildForm(account) {
    return new Promise(reject => {
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
        iso_code : [account.iso_code, [Validators.required, Validators.maxLength(3)]],
        selected : [account.selected,  [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("1"))]],
        value_type : [account.value_type,  [Validators.required, Validators.pattern(this.util.reegex_MaxLengthNumber("1"))]],
        include_total : [account.include_total,  Validators.compose([Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("1"))])],
        rate : [(this.option == this.util.AGREGAR) ? account.rate : this.util.unZeroFile(account.rate), [Validators.required, Validators.pattern(this.util.exprRegular_6Decimal)]],
        icon_name : [account.icon_name,  [Validators.required, Validators.maxLength(20)]],
      });
      if (this.isDelete()) this.disable();
      console.log("account after method buildForm()", this.account);
      reject();
    });
  }
  private getError(controlName: string): string {
    let error = '';
    const control = this.account.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      console.log("Error Control:=[" + controlName + "]", control.errors);
      error = this.util.hasError(control);
    }
    return error;
  }

  private disable() {
    for (let key in this.account.getRawValue()) {
        this.account.get(key).disable();
    }
    this.account.disable();
  }
  private enable() {
    for (let key in this.account.getRawValue()) {
        this.account.get(key).enable();
    }
    this.account.enable();
  }
  private isDelete(): boolean {
    return this.option == this.util.ELIMINAR;
  }
  private closeModal() {
    this.util.cerrarModal("#modalAccount").then(() => {
      console.log("Modal cerrado :v");
      this.option = "";
      this.account = null;
    });
  }
  private operacion() {
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
  private agregarAccount() {
    this.account.patchValue({id_backup: this.id_backup});
    this.addZeroDecimalValue();
    this.util.msjLoading = "Agregando cuenta Id_account: " + this.account.value.id_account + " del Respaldo Id_backup: " + this.id_backup;
    this.util.crearLoading().then(()=> {
      this.accountService.agregarAccount(this.account.value).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) { // Success insert new account
          /*
          * El nuevo account se agrega al arreglo original si esta completa la consulta y se filtran la busqueda nuevamente si esta activada.
          * */
          if (this.util.QueryComplete.isComplete) {
            if (!result.account.error) { // Se recibio correctamente la consulta de la nueva cuenta creada.
              this.accountService.Accounts.push(result.account.new);
              if (this.isFilter()) {
                // Volver a realizar el filtro de las busquedas
                this.proccessFilter();
              }
            } else {
              this.util.msjToast(result.account.msj, this.util.errorRefreshListTable, result.account.error);
            }
          }
          this.closeModal();

        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  private actualizarAccount() {
    this.addZeroDecimalValue();
    this.util.msjLoading = "Actualizando cuenta Id_account: " + this.account.value.id_account + " del Respaldo Id_backup: " + this.id_backup;
    this.util.crearLoading().then(() => {
      this.accountService.actualizarAccount(this.account.value).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          if (!result.account.error) {
            if (this.isFilter()) {
              if (this.indexAccountSelected != -1) this.accountService.Accounts[this.indexAccountSelected] = result.account.update;
              this.accountsFilter[this.indexAccountFilterSelected] = result.account.update;
            } else {
              this.accountService.Accounts[this.indexAccountSelected] = result.account.update;
            }
          } else {
            this.util.msjToast(result.account.msj, this.util.errorRefreshListTable, result.account.error);
          }
          this.closeModal();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  private eliminarAccount() {
    this.util.msjLoading = "Eliminando cuenta Id_account: " + this.account.value.id_account + " del Respaldo Id_backup: " + this.id_backup;
    this.util.crearLoading().then(() => {
      this.accountService.eliminarAccount(this.id_backup, this.account.value.id_account).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) { // splice in the original array account and filterAccount if isFilter()
          if (this.isFilter()) {
            if (this.indexAccountSelected != -1) this.accountService.Accounts.splice(this.indexAccountSelected, 1);
            this.accountsFilter.splice(this.indexAccountFilterSelected, 1);
          } else {
            this.accountService.Accounts.splice(this.indexAccountSelected, 1);
          }
          this.closeModal();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  private addZeroDecimalValue() {
     this.account.patchValue({income: this.util.zeroFile(this.account.value.income)});
     this.account.patchValue({expense: this.util.zeroFile(this.account.value.expense)});
     this.account.patchValue({initial_balance: this.util.zeroFile(this.account.value.initial_balance)});
     this.account.patchValue({final_balance: this.util.zeroFile(this.account.value.final_balance)});
     this.account.patchValue({positive_max: this.util.zeroFile(this.account.value.positive_max)});
     this.account.patchValue({negative_max: this.util.zeroFile(this.account.value.negative_max)});
     this.account.patchValue({rate: this.util.zeroFile(this.account.value.rate)});
     this.account.patchValue({sign: this.util.signValue(this.account.value.sign)});
     console.log("Value this.accout after addZeroFile:=", this.account.value);
  }
}
