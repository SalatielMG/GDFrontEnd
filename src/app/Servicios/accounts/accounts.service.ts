import { Injectable } from '@angular/core';
import { Accounts } from '../../Modelos/accounts/accounts';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FiltersSearchAccounts} from '../../Modelos/accounts/filters-search-accounts';
import {Currencies} from '../../Modelos/currencies/currencies';
import {AccountscategoriesService} from './accountscategories.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  public CurrenciesSelected: Currencies[] = [];
  public CurrenciesGralBackup: Currencies[] = [];
  public Accounts: Accounts[] = [];
  public pagina: number = 0;
  public id_backup: number = 0;
  public filtersSearch = new FiltersSearchAccounts();
  public accountsFilter: Accounts[] = [];
  public indexAccountSelected: number = 0;
  public indexAccountFilterSelected: number = 0;
  public AccountsBackup: Accounts[] = [];

  constructor(private http: HttpClient, private accountsCategoriesBackup: AccountscategoriesService) { }

  public resetearVariables() {
    this.Accounts = [];
    this.pagina = 0;
  }



  // -------------------------------------------------- Filter Seacrh --------------------------------------------------
  public actionFilterEvent(event, value, isKeyUp = false) {
    if (value == "selected" || value == "sign") {
      if (this.filtersSearch[value].value == "-1") {
        this.filtersSearch[value].isFilter = false;
        this.filtersSearch[value].valueAnt = this.filtersSearch[value].value;
        this.proccessFilter();
        return;
      }
    }
    if (value == "id_account") {
      if (this.filtersSearch[value].value == "0") {
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
  public resetValuefiltroSearch(key) {
    this.filtersSearch[key].value =  "";
    this.filtersSearch[key].valueAnt =  "";
    this.filtersSearch[key].isFilter =  false;
    if (key == "selected") this.filtersSearch[key].value = "-1";
    if (key == "id_account") {
      this.filtersSearch[key].value = "0";
      this.accountsCategoriesBackup.obtAccountsBackup(this.id_backup, "0").subscribe(result => {
        if (!result.error) {
          this.AccountsBackup = result.accounts;
        }
      }, error => {
        console.log("Error Interno:=", error);
      });
    }
    if (key == "sign") this.filtersSearch[key].value = "-1";
    if (!this.isFilter()) {
      this.accountsFilter = [];
      return;
    }
    this.proccessFilter();
  }
  public resetFilterisActive() {
    if (!this.isFilter()) {
      this.accountsFilter = [];
      this.accountsFilter =  this.accountsFilter.concat(this.Accounts);
    }
  }
  public proccessFilter() {
    let temp = [];
    this.Accounts.forEach((account) => {

      let bnd = true;
      for (let k in this.filtersSearch) {
        if (this.filtersSearch[k].isFilter) {
          if (((k == "selected" || k == "sign")  && this.filtersSearch[k].value != "-1") || (k == "id_account" && this.filtersSearch[k].value != "0")) {
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
  public isFilter(): boolean {
    for (let key in this.filtersSearch)
      if (this.filtersSearch[key].isFilter) return true;
    return false
  }
  // -------------------------------------------------- Filter Seacrh --------------------------------------------------


  public obtNewId_account():Observable<any> {
    return this.http.get(URL + 'obtNewId_account', {params: {idBack: this.id_backup.toString()}});
  }

  public agregarAccount(account, id_usuario): Observable<any> {
    const  parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append('account', JSON.stringify(account));
    return this.http.post(URL + 'agregarAccount', parametro);
  }
  public actualizarAccount(account, indexUnique, id_usuario): Observable<any> {
    const  parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append('account', JSON.stringify(account))
      .append("indexUnique", JSON.stringify(indexUnique));
    return this.http.post(URL + 'actualizarAccount', parametro);
  }
  public eliminarAccount (indexUnique, id_usuario): Observable<any> {
    return this.http.delete(URL + 'eliminarAccount', {params: {id_usuario: id_usuario, indexUnique: JSON.stringify(indexUnique)}});
  }

  public buscarAccountsBackup(symbolName = "1"): Observable<any> {
    return this.http.get(URL + 'buscarAccountsBackup', {params: {idBack: this.id_backup.toString(), pagina: this.pagina.toString(), symbolName: symbolName}});
  }

  public buscarCurrenciesAccountBackup(): Observable<any> {
    return this.http.get(URL + 'obtCurrenciesGralBackup', {params: {id_backup: this.id_backup.toString()}});
  }

  public buscarInconsistenciaDatos(data, pagina, backups): Observable<any> {
    // this.Accounts = [];
    return this.http.get(URL + 'buscarInconsistenciaDatosAccounts', {params: {dataUser: JSON.stringify(data), pagina: pagina, backups: backups}});
  }

}
