import { Injectable } from '@angular/core';
import { Currencies } from '../../Modelos/currencies/currencies';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FiltersSearchCurrencies} from '../../Modelos/currencies/filters-search-currencies';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {


  public pagina: number = 0;
  public id_backup: number = 0;
  public Currencies: Currencies[] = [];
  public currenciesFilter: Currencies[] = [];
  public filtersSearch = new FiltersSearchCurrencies();
  public indexCurrencySelected: number = 0;
  public indexCurrencyFilterSelected: number = 0;
  public CurrenciesGralBackup: Currencies[] = [];
  //public CurrenciesSelectedBackup: Currencies[] = [];

  constructor(private http: HttpClient) { }

  public resetVariables () {
    this.Currencies = [];
    this.pagina = 0;
  }

  // -------------------------------------------------- Filter Seacrh --------------------------------------------------
  public actionFilterEvent(event, value, isKeyUp = false) {
    if (value == "iso_code") {
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
  public resetValuefiltroSearch(key) {
    this.filtersSearch[key].value =  "";
    this.filtersSearch[key].valueAnt =  "";
    this.filtersSearch[key].isFilter =  false;
    if (key == "iso_code") {
      this.filtersSearch[key].value = "-1";
    }
    if (!this.isFilter()) {
      this.currenciesFilter = [];
      return;
    }
    this.proccessFilter();
  }
  public resetFilterisActive() {
    if (!this.isFilter()) {
      this.currenciesFilter = [];
      this.currenciesFilter =  this.currenciesFilter.concat(this.Currencies);
    }
  }
  public proccessFilter() {
    let temp = [];
    this.Currencies.forEach((currency) => {

      let bnd = true;
      for (let k in this.filtersSearch) {
        if (this.filtersSearch[k].isFilter) {
          if ((k == "iso_code" && this.filtersSearch[k].value != "-1")) {
            if (currency[k].toString() != this.filtersSearch[k].value) {
              bnd = false;
              break;
            }
          } else {
            if (!currency[k].toString().includes(this.filtersSearch[k].value)) {
              bnd = false;
              break;
            }
          }
        }
      }

      if (bnd) {
        temp.push(currency);
      }

    });
    this.currenciesFilter = [];
    this.currenciesFilter = this.currenciesFilter.concat(temp);
    temp = null;
  }
  public isFilter(): boolean {
    for (let key in this.filtersSearch)
      if (this.filtersSearch[key].isFilter) return true;
    return false
  }
  // -------------------------------------------------- Filter Seacrh --------------------------------------------------

  public obtCurrenciesGralBackup(): Observable<any> {
    return this.http.get(URL + "obtCurrenciesGralBackup", {params: {id_backup: this.id_backup.toString()}});
  }
  public buscarCurrenciesBackup(): Observable<any> {
    // this.Currencies = [];
    return this.http.get(URL + 'buscarCurrenciesBackup', {params:{id_backup: this.id_backup.toString(), pagina: this.pagina.toString()}});
  }
  public inconsistenciaDatos(data, pagina, backups): Observable<any> {
    return this.http.get(URL + 'buscarInconsistenciaDatosCurrencies', {params: {dataUser: JSON.stringify(data), pagina: pagina, backups: backups}});
  }

  public insertCurrencies(): Observable<any> {
    return this.http.get(URL + 'insertCurrencies');
  }
  public agregarCurrency(currency, id_usuario): Observable<any> {
    const  parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append('currency', JSON.stringify(currency));
    return this.http.post(URL + "agregarCurrency", parametro);
  }
  public actualizarCurrency(currency, indexUnique, id_usuario): Observable<any> {
    const  parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append('currency', JSON.stringify(currency))
      .append("indexUnique", JSON.stringify(indexUnique));
    return this.http.post(URL + "actualizarCurrency", parametro);
  }
  public eliminarCurrency(indexUnique, id_usuario): Observable<any> {
    return this.http.delete(URL + "eliminarCurrency", {params: {id_usuario: id_usuario, indexUnique: JSON.stringify(indexUnique)}});
  }

}
