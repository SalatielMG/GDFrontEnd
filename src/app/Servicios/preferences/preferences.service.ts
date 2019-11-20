import { Injectable } from '@angular/core';
import { Preferences } from '../../Modelos/preferences/preferences';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FiltersSearchPreferences} from '../../Modelos/preferences/filters-search-preferences';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  public pagina: number = 0;
  public id_backup: number = 0;
  public Preferences: Preferences[] = [];
  public preferencesFilter: Preferences[] = [];
  public filtersSearch = new FiltersSearchPreferences();
  public indexPreferenceSelected: number = 0;
  public indexPreferenceFilterSelected: number = 0;

  constructor(private http: HttpClient) { }

  public resetVariables () {
    this.Preferences = [];
    this.pagina = 0;
  }

  // -------------------------------------------------- Filter Seacrh --------------------------------------------------
  public actionFilterEvent(event, value, isKeyUp = false) {
    if (value == "key_name") {
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
    if (key == "key_name") this.filtersSearch[key].value =  "-1";
    if (!this.isFilter()) {
      this.preferencesFilter = [];
      return;
    }
    this.proccessFilter();
  }
  public resetFilterisActive() {
    if (!this.isFilter()) {
      this.preferencesFilter = [];
      this.preferencesFilter =  this.preferencesFilter.concat(this.Preferences);
    }
  }
  public proccessFilter() {
    let temp = [];
    this.Preferences.forEach((preference) => {

      let bnd = true;
      for (let k in this.filtersSearch) {
        if (this.filtersSearch[k].isFilter) {
          if (k == "key_name" && this.filtersSearch[k].value != "-1") {
            if (preference[k].toString() != this.filtersSearch[k].value) {
              bnd = false;
              break;
            }
          } else if (!preference[k].toString().includes(this.filtersSearch[k].value)) {
            bnd = false;
            break;
          }
        }
      }

      if (bnd) {
        temp.push(preference);
      }

    });
    this.preferencesFilter = [];
    this.preferencesFilter = this.preferencesFilter.concat(temp);
    temp = null;
  }
  public isFilter(): boolean {
    for (let key in this.filtersSearch)
      if (this.filtersSearch[key].isFilter) return true;
    return false
  }
  // -------------------------------------------------- Filter Seacrh --------------------------------------------------

  public buscarPreferencesBackup(): Observable<any> {
    this.Preferences = [];
    return this.http.get(URL + 'buscarPreferencesBackup', {params:{id_backup: this.id_backup.toString()}});
  }
  public inconsistenciaDatos(data, backups): Observable<any> {
    return this.http.get(URL + 'buscarInconsistenciaDatosPreferences', {params: {dataUser: JSON.stringify(data), pagina: this.pagina.toString(), backups: backups}});
  }
  public agregarPreference (preference, id_usuario): Observable<any> {
    const parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append("preference", JSON.stringify(preference));
    return this.http.post(URL + "agregarPreference", parametro);
  }
  public actualizarPreference (preference, indexUnique, id_usuario): Observable<any> {
    const parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append("preference", JSON.stringify(preference))
      .append("indexUnique", JSON.stringify(indexUnique));
    return this.http.post(URL + "actualizarPreference", parametro);
  }
  public eliminarPreference (indexUnique, id_usuario): Observable<any> {
    return this.http.delete(URL + "eliminarPreference", {params: {id_usuario: id_usuario, indexUnique: JSON.stringify(indexUnique)}});
  }
  public corregirInconsistenciaRegistro(preference, id_usuario): Observable<any> {
    return this.http.get(URL + 'corregirInconsistenciaRegistroPreference', {params: {indexUnique: JSON.stringify(preference), id_usuario: id_usuario}})
  }
}
