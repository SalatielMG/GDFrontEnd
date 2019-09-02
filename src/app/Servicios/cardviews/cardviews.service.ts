import { Injectable } from '@angular/core';
import { Cardviews } from '../../Modelos/cardviews/cardviews';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CardviewsService {

  public Cardviews: Cardviews[];

  constructor(private http: HttpClient) { }

  public buscarCardviewsBackup(idBackup): Observable<any> {
    this.Cardviews = [];
    return this.http.get(URL + 'buscarCardviewsBackup', {params:{idBack: idBackup}});
  }

  public inconsistenciaDatos(email): Observable<any> {
    this.Cardviews = [];
    return this.http.get(URL + 'buscarInconsistenciaDatosCardviews', {params: {email: email}});
  }

}
