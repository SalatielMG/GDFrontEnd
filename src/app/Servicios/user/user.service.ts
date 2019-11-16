import { Injectable } from '@angular/core';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Users} from '../../Modelos/users/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public User: Users = null;

  constructor(public http: HttpClient) {
    this.cargarStorageUser();
  }

  public actualizarStorageUser() {
    let data = (this.User != null) ? JSON.stringify(this.User): null;
    localStorage.setItem('userGD', data);
  }

  public cargarStorageUser() {
    let userGD = localStorage.getItem('userGD');
    this.User = (userGD == null || userGD == "null") ? null: JSON.parse(userGD);
    console.log("this.USerStorage", this.User);
  }

  public buscarUser(email): Observable<any> {
    this.User = <Users>{};
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
