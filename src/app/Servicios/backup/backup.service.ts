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

  public buscarBackups(idUser): Observable<any> {
    this.backups = [];
    return this.http.get(URL + 'buscarBackups', {params: {idUser: idUser}});
  }

  public buscarBackupsUserCantidad(email, cantidad): Observable<any> {
    this.mntBackups = [];
    return this.http.get(URL + 'buscarBackupUserCantidad', {params: {email: email, cantidad: cantidad}});
  }
  public corregirInconsistencia(Tabla): Observable<any> {
    return this.http.get(URL + 'corregirInconsistenciaDatos' + Tabla);
  }

}
