import { Injectable } from '@angular/core';
import { Budgets } from '../../Modelos/budgets/budgets';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Accounts} from '../../Modelos/accounts/accounts';
import {FiltersSearchBudgets} from '../../Modelos/budgets/filters-search-budgets';
import {AccountscategoriesService} from '../accounts/accountscategories.service';


@Injectable({
  providedIn: 'root'
})
export class BudgetsService {

  public Budgets: Budgets[] = [];
  public pagina;
  public id_backup;
  public filtersSearch = new FiltersSearchBudgets();
  public budgetsFilter: Budgets[] = [];
  public indexBudgetSelected: number = 0;
  public indexBudgetFilterSelected: number = 0;
  public AccountsBackup: Accounts[] = [];

  constructor(private http: HttpClient, private accountsCategoriesServices: AccountscategoriesService) { }

  public resetVariables() {
    this.Budgets = [];
    this.pagina = 0;
  }

  // -------------------------------------------------- Filter Seacrh --------------------------------------------------
  public obtCategoriesAccountBackup(index) {
    index = parseInt(index);
    this.accountsCategoriesServices.obtCategoriesAccountBackup(this.id_backup, this.AccountsBackup[index].id_account.toString(), "0").subscribe(result => {
      if (!result.error) {
        this.AccountsBackup[index].categoriesAccount = result.categories;
      }
    }, error => {
    });
  }
  public obtAccountsBackup() {
    return new Promise((resolve, reject) => {
      this.accountsCategoriesServices.obtAccountsBackup(this.id_backup, '1', "0").subscribe(result => {
        if (!result.error){
          this.AccountsBackup = result.accounts;
        }
        resolve(result.error);
      }, error => {
        resolve(true);
      });
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
        this.obtCategoriesAccountBackup(this.filtersSearch["indexAccount"].value);
    }

    if (!this.isFilter()) {
      this.budgetsFilter = [];
      return;
    }
    this.proccessFilter();
  }
  public resetFilterisActive() {
    if (!this.isFilter()) {
      this.budgetsFilter = [];
      this.budgetsFilter =  this.budgetsFilter.concat(this.Budgets);
    }
  }
  public proccessFilter() {
    let temp = [];
    this.Budgets.forEach((budgets) => {

      let bnd = true;
      for (let k in this.filtersSearch) {
        if (this.filtersSearch[k].isFilter) {
          if ((k == "indexAccount" && this.filtersSearch[k].value != "-1") || (k == "id_category" && this.filtersSearch[k].value != "0")) {
            let kk = (k == "indexAccount") ? "id_account": k;
            if (budgets[kk].toString() != ((k == "indexAccount") ? this.AccountsBackup[parseInt(this.filtersSearch[k].value)].id_account : this.filtersSearch[kk].value)) {
              bnd = false;
              break;
            }
          } else {
            if (!budgets[k].toString().includes(this.filtersSearch[k].value)) {
              bnd = false;
              break;
            }
          }
        }
      }

      if (bnd) {
        temp.push(budgets);
      }

    });
    this.budgetsFilter = [];
    this.budgetsFilter = this.budgetsFilter.concat(temp);
    temp = null;
  }
  public isFilter(): boolean {
    for (let key in this.filtersSearch)
      if (this.filtersSearch[key].isFilter) return true;
    return false
  }
  // -------------------------------------------------- Filter Seacrh --------------------------------------------------

  public buscarBudgetsBackup(): Observable<any> {
    return this.http.get(URL + 'buscarBudgetsBackup', {params: {idBack: this.id_backup, pagina: this.pagina}});
  }

  public inconsistenciaDatos(data, backups): Observable<any> {
    return this.http.get(URL + 'buscarInconsistenciaDatosBudgets', {params: {dataUser: JSON.stringify(data), pagina: this.pagina.toString(), backups: backups}});
  }

  public agregarBudget(budget, id_usuario): Observable<any> {
    const  parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append('budget', JSON.stringify(budget));
    return this.http.post(URL + 'agregarBudget', parametro);
  }

  public actualizarBudget(budget, indexUnique,id_usuario): Observable<any> {
    const  parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append('budget', JSON.stringify(budget))
      .append("indexUnique", JSON.stringify(indexUnique));
    return this.http.post(URL + 'actualizarBudget', parametro);
  }

  public eliminarBudget(indexUnique, id_usuario): Observable<any> {
    return this.http.delete(URL + 'eliminarBudget', {params: {id_usuario: id_usuario, indexUnique: JSON.stringify(indexUnique)}});
  }

}
