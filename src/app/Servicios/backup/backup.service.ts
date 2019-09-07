import { Injectable } from '@angular/core';
import { URL } from '../../Utilerias/URL';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Backup} from '../../Modelos/Backup/backup';

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  public backups: Backup[];
  public mntBackups: Backup[];

  constructor(public http: HttpClient) {
  }

  public eliminarBackup(id): Observable<any> {
    /*const  parametro = new HttpParams()
      .append('id', id);*/
    return this.http.delete(URL + 'eliminarBackup', {params: {id: id}});
  }

  public buscarBackups(idUser, order = "desc"): Observable<any> {
    this.backups = [];
    return this.http.get(URL + 'buscarBackups', {params: {idUser: idUser, orderby: order}});
  }

  public buscarBackupsUserCantidad(email, cantidad, pagina): Observable<any> {
    this.mntBackups = [];
    return this.http.get(URL + 'buscarBackupUserCantidad', {params: {email: email, cantidad: cantidad, pagina: pagina}});
  }
  public corregirInconsistencia(Tabla): Observable<any> {
    return this.http.get(URL + 'corregirInconsistenciaDatos' + Tabla);
  }
  public limpiarBackups(idUser, email, rango , cantidad):Observable<any> {
    const param = (idUser == "0") ? {idUser: idUser, rango: rango} : {idUser: idUser, email: email , rango: rango, cantidad: cantidad};
    return this.http.delete(URL + 'limpiarBackups', {params : param});
  }

}
