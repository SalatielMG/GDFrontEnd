import { Injectable } from '@angular/core';
import { Categories } from '../../Modelos/categories/categories';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FiltersSearchCategories} from '../../Modelos/categories/filters-search-categories';
import {Accounts} from '../../Modelos/accounts/accounts';
import {AccountscategoriesService} from '../accounts/accountscategories.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  public Categories: Categories[] = [];
  public pagina;
  public id_backup;
  public filtersSearch = new FiltersSearchCategories();
  public categoriesFilter: Categories[] = [];
  public indexCategorySelected: number = 0;
  public indexCategoryFilterSelected: number = 0;
  public AccountsBackup: Accounts[] = [];


  constructor(private http: HttpClient, public accountsCategoriesServices: AccountscategoriesService) { }

  public resetVariables() {
    this.Categories = [];
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
    } else if (value == "id_category") {
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
      this.categoriesFilter = [];
      return;
    }
    this.proccessFilter();
  }
  public resetFilterisActive() {
    if (!this.isFilter()) {
      this.categoriesFilter = [];
      this.categoriesFilter =  this.categoriesFilter.concat(this.Categories);
    }
  }
  public proccessFilter() {
    let temp = [];
    this.Categories.forEach((category) => {

      let bnd = true;
      for (let k in this.filtersSearch) {
        if (this.filtersSearch[k].isFilter) {
          if (((k == "indexAccount" || k == "sign") && this.filtersSearch[k].value != "-1") || (k == "id_category" && this.filtersSearch[k].value != "0")) {
            let kk = (k == "indexAccount") ? "id_account": k;
            if (category[kk].toString() != ((k == "indexAccount") ? this.AccountsBackup[parseInt(this.filtersSearch[k].value)].id_account : this.filtersSearch[kk].value)) {
              bnd = false;
              break;
            }
          } else {
            if (!category[k].toString().includes(this.filtersSearch[k].value)) {
              bnd = false;
              break;
            }
          }
        }
      }

      if (bnd) {
        temp.push(category);
      }

    });
    this.categoriesFilter = [];
    this.categoriesFilter = this.categoriesFilter.concat(temp);
    temp = null;
  }
  public isFilter(): boolean {
    for (let key in this.filtersSearch)
      if (this.filtersSearch[key].isFilter) return true;
    return false
  }
  // -------------------------------------------------- Filter Seacrh --------------------------------------------------

  public obtNewId_Category(): Observable<any> {
    return this.http.get(URL + 'obtNewId_Category', {params: {id_backup: this.id_backup}});
  }
  public buscarCategoriesBackup(): Observable<any> {
    return this.http.get(URL + 'buscarCategoriesBackup', {params: {id_backup: this.id_backup, pagina: this.pagina}});
  }

  public inconsistenciaDato(data, backups): Observable<any> {
    return this.http.get(URL + 'buscarInconsistenciaDatosCategories', {params: {dataUser: JSON.stringify(data), pagina: this.pagina.toString(), backups: backups}});
  }

  public agregarCategory(category, id_usuario): Observable<any> {
    const  parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append('category', JSON.stringify(category));
    return this.http.post(URL + 'agregarCategoria', parametro);
  }

  public actualizarCategory(category, indexUnique, id_usuario): Observable<any> {
    const  parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append('category', JSON.stringify(category))
      .append("indexUnique", JSON.stringify(indexUnique));
    return this.http.post(URL + 'actualizarCategoria', parametro);
  }
  public eliminarCategory(indexUnique, id_usuario): Observable<any> {
    return this.http.delete(URL + "eliminarCategoria", {params: {id_usuario: id_usuario, indexUnique: JSON.stringify(indexUnique)}});

  }
  public corregirInconsistenciaRegistro(category, id_usuario): Observable<any> {
    return this.http.get(URL + 'corregirInconsistenciaRegistroCategory', {params: {indexUnique: JSON.stringify(category), id_usuario: id_usuario}});
  }

}
