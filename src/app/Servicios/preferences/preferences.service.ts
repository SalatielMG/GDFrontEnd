import { Injectable } from '@angular/core';
import { Preferences } from '../../Modelos/preferences/preferences';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  public Preferences: Preferences[];

  constructor(private http: HttpClient) { }

  public buscarPreferencesBackup(idBackup): Observable<any> {
    this.Preferences = [];
    return this.http.get(URL + 'buscarPreferencesBackup', {params:{idBack: idBackup}});
  }
  public inconsistenciaDatos(data, pagina, backups): Observable<any> {
    return this.http.get(URL + 'buscarInconsistenciaDatosPreferences', {params: {dataUser: JSON.stringify(data), pagina: pagina, backups: backups}});
  }

}
