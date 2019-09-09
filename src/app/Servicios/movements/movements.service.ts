import { Injectable } from '@angular/core';
import { Movements } from '../../Modelos/movements/movements';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {

  public Movements: Movements[];

  constructor(private http: HttpClient) { }

  public buscarMovementsBackup(idBackup): Observable<any> {
    this.Movements = [];
    return this.http.get(URL + 'buscarMovementsBackup', {params:{idBack: idBackup}});
  }
  public inconsistenciaDatos(email, pagina): Observable<any> {
    return this.http.get(URL + 'buscarInconsistenciaDatosMovements', {params: {email: email, pagina: pagina}});
  }

}
