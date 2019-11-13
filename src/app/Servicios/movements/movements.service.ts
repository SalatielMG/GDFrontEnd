import { Injectable } from '@angular/core';
import { Movements } from '../../Modelos/movements/movements';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FiltersSearchMovements} from '../../Modelos/movements/filters-search-movements';
import {Accounts} from '../../Modelos/accounts/accounts';
import {AccountscategoriesService} from '../accounts/accountscategories.service';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {

  public Movements: Movements[] = [];
  public pagina = 0;
  public id_backup = 0;
  public filtersSearch = new FiltersSearchMovements();
  public movementsFilter: Movements[] = [];
  public indexMovementSelected: number = 0;
  public indexMovementFilterSelected: number = 0;
  public AccountsBackup: Accounts[] = [];

  constructor(private http: HttpClient, public accountsCategoriesServices: AccountscategoriesService) { }

  public resetVariables() {
    this.Movements = [];
    this.pagina = 0;
  }

  // -------------------------------------------------- Filter Seacrh --------------------------------------------------
  public obtCategoriesAccountBackup(index) {
    index = parseInt(index);
    this.accountsCategoriesServices.obtCategoriesAccountBackup(this.id_backup, this.AccountsBackup[index].id_account.toString()).subscribe(result => {
      if (!result.error) {
        this.AccountsBackup[index].categoriesAccount = result.categories;
        console.log("new Categories query:= ", this.AccountsBackup[index].categoriesAccount);
      }
    }, error => {
      console.log(error);
    });
  }
  public obtAccountsBackup() {
    return new Promise((resolve, reject) => {
      this.accountsCategoriesServices.obtAccountsBackup(this.id_backup).subscribe(result => {
        if (!result.error){
          this.AccountsBackup = result.accounts;
          console.log("new Accounts query := ", this.AccountsBackup);
        }
        resolve(result.error);
      }, error => {
        console.log("error:=", error);
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
      this.movementsFilter = [];
      return;
    }
    this.proccessFilter();
  }
  public resetFilterisActive() {
    if (!this.isFilter()) {
      this.movementsFilter = [];
      this.movementsFilter =  this.movementsFilter.concat(this.Movements);
    }
  }
  public proccessFilter() {
    let temp = [];
    this.Movements.forEach((movement) => {

      let bnd = true;
      for (let k in this.filtersSearch) {
        if (this.filtersSearch[k].isFilter) {
          if (((k == "indexAccount" || k == "sign") && this.filtersSearch[k].value != "-1") || (k == "id_category" && this.filtersSearch[k].value != "0")) {
            let kk = (k == "indexAccount") ? "id_account": k;
            if (movement[kk].toString() != ((k == "indexAccount") ? this.AccountsBackup[parseInt(this.filtersSearch[k].value)].id_account : this.filtersSearch[kk].value)) {
              bnd = false;
              break;
            }
          } else {
            if (k == "date_record") {
              let date = "";
              this.filtersSearch[k].value.toLocaleDateString().split("/").reverse().forEach((d) => {
                date += ((d.length == 1) ? "0" + d : d) + "-";
              });
              date = date.substring(0, date.length - 1);
              /*console.log("FiltroSearch Value = ", date);
              console.log("movement [" + k + "] Value = ", movement[k]);*/
              if (!movement[k].toString().includes(date)){
                bnd = false;
                break;
              }
            } else {
              if (!movement[k].toString().includes(this.filtersSearch[k].value)) {
                bnd = false;
                break;
              }
            }

          }
        }
      }

      if (bnd) {
        temp.push(movement);
      }

    });
    this.movementsFilter = [];
    this.movementsFilter = this.movementsFilter.concat(temp);
    temp = null;
  }
  public isFilter(): boolean {
    for (let key in this.filtersSearch)
      if (this.filtersSearch[key].isFilter) return true;
    return false
  }
  // -

  public buscarMovementsBackup(): Observable<any> {
    return this.http.get(URL + 'buscarMovementsBackup', {params:{id_backup: this.id_backup.toString(), pagina: this.pagina.toString()}});
  }
  public inconsistenciaDatos(data, backups): Observable<any> {
    return this.http.get(URL + 'buscarInconsistenciaDatosMovements', {params: {dataUser: JSON.stringify(data), pagina: this.pagina.toString(), backups: backups}});
  }
  public agregarMovement (movement, id_usuario): Observable<any> {
    const  parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append('movement', JSON.stringify(movement));
    return this.http.post(URL + "agregarMovement", parametro);
  }
  public actualizarMovement (movement, indexUnique, id_usuario): Observable<any> {
    const  parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append('movement', JSON.stringify(movement))
      .append("indexUnique", JSON.stringify(indexUnique));
    return this.http.post(URL + "actualizarMovement", parametro);
  }
  public eliminarMovement (indexUnique, id_usuario): Observable<any> {
    return this.http.delete(URL + "eliminarMovement", {params : {id_usuario: id_usuario, indexUnique: JSON.stringify(indexUnique)}});
  }
}
