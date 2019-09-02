import { Injectable } from '@angular/core';
import { Extras } from '../../Modelos/extras/extras';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExtrasService {

  public Extras: Extras[];

  constructor(private http: HttpClient) { }

  public buscarExtrasBackup(idBackup): Observable<any> {
    this.Extras = [];
    return this.http.get(URL + 'buscarExtrasBackup', {params:{idBack: idBackup}});
  }
  public inconsistenciaDatos(email): Observable<any> {
    this.Extras = [];
    return this.http.get(URL + 'buscarInconsistenciaDatosExtras', {params: {email: email}});
  }

}
