import { Injectable } from '@angular/core';
import { Extras } from '../../Modelos/extras/extras';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FiltersSearchExtras} from '../../Modelos/extras/filters-search-extras';

@Injectable({
  providedIn: 'root'
})
export class ExtrasService {

  public pagina: number = 0;
  public id_backup: number = 0;
  public Extras: Extras[] = [];
  public extrasFilter: Extras[] = [];
  public filtersSearch = new FiltersSearchExtras();
  public indexExtraSelected: number = 0;
  public indexExtraFilterSelected: number = 0;

  constructor(private http: HttpClient) { }

  public resetVariables () {
    this.Extras = [];
    this.pagina = 0;
  }
  // -------------------------------------------------- Filter Seacrh --------------------------------------------------
  public actionFilterEvent(event, value, isKeyUp = false) {
    if (isKeyUp && event.key != "Enter") return;
    if (this.filtersSearch[value].value == "") return;
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
    if (!this.isFilter()) {
      this.extrasFilter = [];
      return;
    }
    this.proccessFilter();
  }
  public resetFilterisActive() {
    if (!this.isFilter()) {
      this.extrasFilter = [];
      this.extrasFilter =  this.extrasFilter.concat(this.Extras);
    }
  }
  public proccessFilter() {
    let temp = [];
    this.Extras.forEach((extra) => {

      let bnd = true;
      for (let k in this.filtersSearch) {
        if (this.filtersSearch[k].isFilter) {
          if (!extra[k].toString().includes(this.filtersSearch[k].value)) {
            bnd = false;
            break;
          }
        }
      }

      if (bnd) {
        temp.push(extra);
      }

    });
    this.extrasFilter = [];
    this.extrasFilter = this.extrasFilter.concat(temp);
    temp = null;
  }
  public isFilter(): boolean {
    for (let key in this.filtersSearch)
      if (this.filtersSearch[key].isFilter) return true;
    return false
  }
  // -------------------------------------------------- Filter Seacrh --------------------------------------------------

  public buscarExtrasBackup(): Observable<any> {
    return this.http.get(URL + 'buscarExtrasBackup', {params:{id_backup: this.id_backup.toString(), pagina: this.pagina.toString()}});
  }
  public inconsistenciaDatos(data, backups): Observable<any> {
    return this.http.get(URL + 'buscarInconsistenciaDatosExtras', {params: {dataUser: JSON.stringify(data), pagina: this.pagina.toString(), backups: backups}});
  }

  public agregarExtra (extra, id_usuario): Observable<any> {
    const parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append("extra", JSON.stringify(extra));
    return this.http.post(URL + "agregarExtra", parametro);
  }
  public actualizarExtra (extra, indexUnique, id_usuario): Observable<any> {
    const parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append("extra", JSON.stringify(extra))
      .append("indexUnique", JSON.stringify(indexUnique));
    return this.http.post(URL + "actualizarExtra", parametro);
  }
  public eliminarExtra (indexUnique, id_usuario): Observable<any> {
    return this.http.delete(URL + "eliminarExtra", {params: {id_usuario: id_usuario, indexUnique: JSON.stringify(indexUnique)}});
  }
  public corregirInconsistenciaRegistro(extra, id_usuario): Observable<any> {
    return this.http.get(URL + 'corregirInconsistenciaRegistroExtra', {params: {indexUnique: JSON.stringify(extra), id_usuario: id_usuario}});
  }

}
