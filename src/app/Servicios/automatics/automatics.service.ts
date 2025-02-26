import { Injectable } from '@angular/core';
import { Automatics } from '../../Modelos/automatics/automatics';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FiltersSearchAutomatics} from '../../Modelos/automatics/filters-search-automatics';
import {Accounts} from '../../Modelos/accounts/accounts';
import {AccountscategoriesService} from '../accounts/accountscategories.service';
import {stringify} from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class AutomaticsService {

  public Automatics: Automatics[] = [];
  public pagina;
  public id_backup;
  public filtersSearch = new FiltersSearchAutomatics();
  public automaticsFilter: Automatics[] = [];
  public indexAutomaticSelected: number = 0;
  public indexAutomaticFilterSelected: number = 0;
  public AccountsBackup: Accounts[] = [];

  constructor(private http: HttpClient, private accountsCategoriesServices: AccountscategoriesService) { }

  public resetearVarables() {
    this.Automatics = [];
    this.pagina = 0;
  }
  // -------------------------------------------------- Filter Seacrh --------------------------------------------------
  public obtCategoriesAccountBackup(index) {
    index = parseInt(index);
    this.accountsCategoriesServices.obtCategoriesAccountBackup(this.id_backup, this.AccountsBackup[index].id_account.toString()).subscribe(result => {
      if (!result.error) {
        this.AccountsBackup[index].categoriesAccount = result.categories;
      }
    }, error => {
    });
  }
  public obtAccountsBackup() {
    return new Promise((resolve, reject) => {
      this.accountsCategoriesServices.obtAccountsBackup(this.id_backup).subscribe(result => {
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
    if (value == "indexAccount" || value == "sign") {
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
    if (key == "sign") this.filtersSearch[key].value = "-1";
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
          if (((k == "indexAccount" || k == "sign") && this.filtersSearch[k].value != "-1") || (k == "id_category" && this.filtersSearch[k].value != "0")) {
            let key = (k == "indexAccount") ? "id_account": k;
            let value = (key == "id_account") ? this.AccountsBackup[parseInt(this.filtersSearch[k].value)].id_account.toString() : this.filtersSearch[key].value.toString();
            if (automatic[key].toString() != value) {
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
    return this.http.get(URL + "obtNewId_OperationAccountsCategories", {params: {id_backup: this.id_backup}});
  }

  public buscarAutomaticsBackup(): Observable<any> {
    return this.http.get(URL + 'buscarAutomaticsBackup', {params: {idBack: this.id_backup, pagina: this.pagina}});
  }

  public buscarInconsistenciaDatos(data, backups): Observable<any> {
    return this.http.get(URL + 'buscarInconsistenciaDatosAutomatics', {params: {dataUser: JSON.stringify(data), pagina: this.pagina.toString(), backups: backups}});
  }

  public agregarAutomatic(automatic, id_usuario): Observable<any> {
    const  parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append('automatic', JSON.stringify(automatic));
    return this.http.post(URL + 'agregarAutomatic', parametro);
  }

  public actualizarAutomatic(automatic, indexUnique, id_usuario): Observable<any> {
    const  parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append('automatic', JSON.stringify(automatic))
      .append("indexUnique", JSON.stringify(indexUnique));
    return this.http.post(URL + 'actualizarAutomatic', parametro);
  }

  public eliminarAutomatic(indexUnique, id_usuario): Observable<any> {
    return this.http.delete(URL + 'eliminarAutomatic', {params : {id_usuario: id_usuario, indexUnique: JSON.stringify(indexUnique)}});
  }
  public corregirInconsistenciaRegistro(automatic, id_usuario): Observable<any> {
    return this.http.get(URL + 'corregirInconsistenciaRegistroAutomatic',  {params: {indexUnique: JSON.stringify(automatic), id_usuario: id_usuario}});
  }
}
