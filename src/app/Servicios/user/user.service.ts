import { Injectable } from '@angular/core';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Users} from '../../Modelos/users/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public User: Users;
  public dataGrafica = [];

  constructor(public http: HttpClient) { }

  public buscarUser(email): Observable<any> {
    this.User = <Users>{};
    console.log(email);
    const  parametro = new HttpParams()
      .append('email', email);
    return this.http.post(URL + 'buscarUser', parametro);
  }
  public obtValoresGrafica(idUser, tipo, idBackup = "0", idCuenta = "0", año = "0", mes = "0") : Observable<any> {
    const  parametro = new HttpParams()
      .append('idUser', idUser)
      .append('tipo', tipo)
      .append("idBackup", idBackup)
      .append("idCuenta", idCuenta)
      .append("año", año)
      .append("mes", mes);
    return this. http.get(URL + "valoresGrafica", {params: parametro});
  }
  public obtValoresGraficaGVSI(idUser, idBackup = "0", año = "0") : Observable<any> {
    const  parametro = new HttpParams()
      .append('idUser', idUser)
      .append("idBackup", idBackup)
      .append("año", año);
    return this.http.get(URL + "valoresGraficaGVSI", {params: parametro});
  }
}
