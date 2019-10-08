import { Injectable } from '@angular/core';
import { Automatics } from '../../Modelos/automatics/automatics';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FiltersSearchAutomatics} from '../../Modelos/automatics/filters-search-automatics';
import {Accounts} from '../../Modelos/accounts/accounts';

@Injectable({
  providedIn: 'root'
})
export class AutomaticsService {

  public id_backup;
  public Automatics: Automatics[] = [];
  public pagina;
  public filtersSearch = new FiltersSearchAutomatics();
  public automaticsFilter: Automatics[] = [];
  public indexAutomaticSelected: number = 0;
  public indexAutomaticFilterSelected: number = 0;
  public AccountsBackup: Accounts[] = [];

  constructor(private http: HttpClient) { }

  public resetearVarables() {
    this.Automatics = [];
    this.pagina = 0;
  }
  // -------------------------------------------------- Filter Seacrh --------------------------------------------------
  private obtCategoriesAccountBackup() {
    this.http.get(URL + "obtCategoriesAccountBackup", {params: {id_backup: this.id_backup, id_account: this.AccountsBackup[parseInt(this.filtersSearch["indexAccount"].value)].id_account.toString()}}).subscribe(result => {
      if (!result["error"]) {
        this.AccountsBackup[parseInt(this.filtersSearch["indexAccount"].value)].categoriesAccount = result["categories"];
        console.log("new Categories query:= ", this.AccountsBackup[parseInt(this.filtersSearch["indexAccount"].value)].categoriesAccount);
      }
    }, error => {
      console.log(error);
    });
  }
  private obtAccountsBackup() {
    this.http.get(URL + "obtAccountsBackup", {params: {id_backup: this.id_backup}}).subscribe(result => {
      if (!result["error"]){
        this.AccountsBackup = result["accounts"];
        console.log("new Accounts query := ", this.AccountsBackup);
      }
    }, error => {
      console.log("error:=", error);
    });
  }
  public actionFilterEvent(event, value, isKeyUp = false) {
    if (value == "indexAccount") {
      if (this.filtersSearch[value].value == "-1") {
        this.obtAccountsBackup();
        this.filtersSearch[value].isFilter = false;
        this.filtersSearch[value].valueAnt = this.filtersSearch[value].value;
        this.proccessFilter();
        return;
      } else {
        //this.obtCategoriesAccountBackup();
        this.resetValuefiltroSearch("id_category");
      }
    }
    if (value == "id_category") {
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
    if (key == "indexAccount") {
      this.filtersSearch[key].value = "-1";
      this.obtAccountsBackup();
    }
    if (key == "id_category") {
      this.filtersSearch[key].value = "0";
      if (this.filtersSearch["indexAccount"].value != "-1")
        this.obtCategoriesAccountBackup();
    }

    if (!this.isFilter()) {
      this.automaticsFilter = [];
      return;
    }
    this.proccessFilter();
  }
  public resetFilterisActive() {
    if (!this.isFilter()) {
      this.automaticsFilter = [];
      this.automaticsFilter =  this.automaticsFilter.concat(this.Automatics);
    }
  }
  public proccessFilter() {
    let temp = [];
    this.Automatics.forEach((automatic) => {

      let bnd = true;
      for (let k in this.filtersSearch) {
        if (this.filtersSearch[k].isFilter) {
          if ((k == "indexAccount" && this.filtersSearch[k].value != "-1") || (k == "id_category" && this.filtersSearch[k].value != "0")) {
            let kk = (k == "indexAccount") ? "id_account": k;
            if (automatic[kk].toString() != ((k == "indexAccount") ? this.AccountsBackup[parseInt(this.filtersSearch[k].value)].id_account : this.filtersSearch[kk].value)) {
              bnd = false;
              break;
            }
          } else {
            if (!automatic[k].toString().includes(this.filtersSearch[k].value)) {
              bnd = false;
              break;
            }
          }
        }
      }

      if (bnd) {
        temp.push(automatic);
      }

    });
    this.automaticsFilter = [];
    this.automaticsFilter = this.automaticsFilter.concat(temp);
    temp = null;
  }
  public isFilter(): boolean {
    for (let key in this.filtersSearch)
      if (this.filtersSearch[key].isFilter) return true;
    return false
  }
  // -------------------------------------------------- Filter Seacrh --------------------------------------------------

  public obtNewId_OperationAccountsCategories(): Observable<any> {
    return this.http.get(URL + "obtNewId_OperationAccountsCategories", {params: {idBack: this.id_backup}});
  }

  public buscarAutomaticsBackup(): Observable<any> {
    this.Automatics = [];
    return this.http.get(URL + 'buscarAutomaticsBackup', {params:{idBack: this.id_backup, pagina: this.pagina}});
  }

  public buscarInconsistenciaDatos(data, pagina, backups): Observable<any> {
    return this.http.get(URL + 'buscarInconsistenciaDatosAutomatics', {params: {dataUser: JSON.stringify(data), pagina: pagina, backups: backups}});
  }

}
