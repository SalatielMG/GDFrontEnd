import { Injectable } from '@angular/core';
import { URL } from '../../Utilerias/URL';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Backup } from '../../Modelos/Backup/backup';
import {UserBackupsMnt} from "../../Modelos/User/userBackupsMnt";

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  public paginaB: number = 0;
  public backups: Backup[];
  public userBackupsMnt: UserBackupsMnt[] = [];

  constructor(public http: HttpClient) {
  }

  public resetearBaackups() {
    this.backups = [];
    this.paginaB = 0;
  }
  public eliminarBackup(id): Observable<any> {
    /*const  parametro = new HttpParams()
      .append('id', id);*/
    return this.http.delete(URL + 'eliminarBackup', {params: {id: id}});
  }
  public buscarBackupsUserEmail(email, pagina, order = "desc"): Observable<any> {
    return this.http.get(URL + 'buscarBackupsUserEmail', {params: {email: email, pagina: pagina, orderby: order}});
  }
  public buscarBackupsUserId(idUser, pagina, order = "desc"): Observable<any> {
    //this.backups = [];
    return this.http.get(URL + 'buscarBackupsUserId', {params: {idUser: idUser, pagina: pagina, orderby: order}});
  }

  public buscarBackupsUserMnt(email, cantidad, pagina): Observable<any> {
    // this.userBackupsMnt = [];
    return this.http.get(URL + 'buscarBackupsUserMnt', {params: {email: email, cantidad: cantidad, pagina: pagina}});
  }
  public corregirInconsistencia(Tabla): Observable<any> {
    return this.http.get(URL + 'corregirInconsistenciaDatos' + Tabla);
  }
  public limpiarBackups(idUser, email, rango , cantidad):Observable<any> {
    const param = (email == "Generales") ? {idUser: idUser, rango: rango} : {idUser: idUser, email: email , rango: rango, cantidad: cantidad};
    return this.http.delete(URL + 'limpiarBackups', {params : param});
  }
  public limpiarBackupsUsers(users, rangoBackups): Observable<any> {
    return this.http.delete(URL + "limpiarBackupsUsers", {params: {users: JSON.stringify(users), rangoBackups: rangoBackups}});
  }
}
