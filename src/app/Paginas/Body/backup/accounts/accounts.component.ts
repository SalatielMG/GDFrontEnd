import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '../../../../Servicios/accounts/accounts.service';
import { Utilerias } from '../../../../Utilerias/Util';
import {Accounts} from "../../../../Modelos/accounts/accounts";
import {FiltersSearchAccounts} from "../../../../Modelos/accounts/filters-search-accounts";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {reject} from 'q';

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
        name : [account.name, Validators.required],
        detail : [account.detail, Validators.required],
        sign : [account.sign, Validators.required],
        income : [account.income, [Validators.required, Validators.pattern(this.util.exprRegular_6Decimal)]],
        expense : [account.expense, [Validators.required, Validators.pattern(this.util.exprRegular_6Decimal)]],
        initial_balance : [account.initial_balance, [Validators.required, Validators.pattern(this.util.exprRegular_6Decimal)]],
        final_balance : [account.final_balance, [Validators.required, Validators.pattern(this.util.exprRegular_6Decimal)]],
        month : [account.month],
        year : [account.year, Validators.required],
        positive_limit : [account.positive_limit, Validators.required],
        negative_limit : [account.negative_limit, Validators.required],
        positive_max : [account.positive_max, [Validators.required, Validators.pattern(this.util.exprRegular_6Decimal)]],
        negative_max : [account.negative_max, [Validators.required, Validators.pattern(this.util.exprRegular_6Decimal)]],
        iso_code : [account.iso_code, Validators.required],
        selected : [account.selected, Validators.required],
        value_type : [account.value_type, Validators.required],
        include_total : [account.include_total, Validators.required],
        rate : [account.rate, [Validators.required, Validators.pattern(this.util.exprRegular_6Decimal)]],
        icon_name : [account.icon_name, Validators.required],
      });
      if (this.isDelete()) this.disable();
      console.log("account after method buildForm()", this.account);
      reject();
    });
  }
  private getError(controlName: string): string {
    let error = '';
    const control = this.account.get(controlName);
    if (control.touched && control.errors != null) {
      error = JSON.stringify(control.errors);
    }
    if (error != '')
    console.error("Error CONTROL: = " + controlName, error);
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

  }
  private actualizarAccount() {

  }
  private eliminarAccount() {

  }
}
