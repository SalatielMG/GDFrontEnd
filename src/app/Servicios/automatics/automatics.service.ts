import { Injectable } from '@angular/core';
import { Automatics } from '../../Modelos/automatics/automatics';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FiltersSearchAutomatics} from '../../Modelos/automatics/filters-search-automatics';

@Injectable({
  providedIn: 'root'
})
export class AutomaticsService {

  public Automatics: Automatics[] = [];
  public pagina;
  public filtersSearch = new FiltersSearchAutomatics();
  public automaticsFilter: Automatics[] = [];
  public indexAutomaticSelected: number = 0;
  public indexAutomaticFilterSelected: number = 0;

  constructor(private http: HttpClient) { }

  public resetearVarables() {
    this.Automatics = [];
    this.pagina = 0;
  }
  // -------------------------------------------------- Filter Seacrh --------------------------------------------------
  public actionFilterEvent(event, value, isKeyUp = false) {
    if (value == "nameAccount" || value == "nameCategory") {
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
    if (key == "nameAccount" || key == "nameCategory") this.filtersSearch[key].value = "0";

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
    this.Automatics.forEach((account) => {

      let bnd = true;
      for (let k in this.filtersSearch) {
        if (this.filtersSearch[k].isFilter) {
          if ((k == "nameAccount" && this.filtersSearch[k].value != "0") || (k == "nameCategory" && this.filtersSearch[k].value != "0")) {
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

  public obtNewId_OperationAccountsCategories(idBackup): Observable<any> {
    return this.http.get(URL + "obtNewId_OperationAccountsCategories", {params: {idBack: idBackup}});
  }

  public buscarAutomaticsBackup(idBackup): Observable<any> {
    this.Automatics = [];
    return this.http.get(URL + 'buscarAutomaticsBackup', {params:{idBack: idBackup, pagina: this.pagina}});
  }

  public buscarInconsistenciaDatos(data, pagina, backups): Observable<any> {
    return this.http.get(URL + 'buscarInconsistenciaDatosAutomatics', {params: {dataUser: JSON.stringify(data), pagina: pagina, backups: backups}});
  }

}
