import { Injectable } from '@angular/core';
import { URL } from '../../Utilerias/URL';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {UsersBackupsMnt} from "../../Modelos/users/usersBackupsMnt";

@Injectable({
  providedIn: 'root'
})
export class BackupService {

  public indexUser: number = 0;
  public pagina: number = 0;
  // public backups: Backup[];
  public userBackups: UsersBackupsMnt[] = [];

  constructor(public http: HttpClient) {
  }

  public resetearBackups() {
    this.userBackups = [];
    this.pagina = 0;
    this.indexUser = 0;
    this.userBackups = [];
  }


  // -------------------------------- Filter Backups users --------------------------------
  public actionFilterEvent(event, value, isKeyUp = false, index = 0,) {
    if (value == "automatic") {
      if (this.userBackups[index].filtrosSearch[value].value == "-1") {
        this.userBackups[index].filtrosSearch[value].isFilter = false;
        this.userBackups[index].filtrosSearch[value].valueAnt = this.userBackups[index].filtrosSearch[value].value;
        this.proccessFilter(index);
        return;
      }
    } else {
      if (isKeyUp && event.key != "Enter") return;
      if (this.userBackups[index].filtrosSearch[value].value == "") return;
    }
    if (this.userBackups[index].filtrosSearch[value].value == this.userBackups[index].filtrosSearch[value].valueAnt) return;
    this.resetFilterisActive(index);
    this.userBackups[index].filtrosSearch[value].isFilter = true;
    this.userBackups[index].filtrosSearch[value].valueAnt = this.userBackups[index].filtrosSearch[value].value;
    this.proccessFilter(index);
  }
  public resetValuefiltroSearch(key, index = 0) {
    this.userBackups[index].filtrosSearch[key].value =  "";
    this.userBackups[index].filtrosSearch[key].valueAnt =  "";
    this.userBackups[index].filtrosSearch[key].isFilter =  false;
    if (key == "automatic") this.userBackups[index].filtrosSearch[key].value = "-1";

    if (!this.isFilter(index)) {
      this.userBackups[index].backupsFiltro = [];
      return;
    }
    this.proccessFilter(index);
  }
  public resetFilterisActive(index = 0) {
    if (!this.isFilter(index)) {
      this.userBackups[index].backupsFiltro = [];
      this.userBackups[index].backupsFiltro =  this.userBackups[index].backupsFiltro.concat(this.userBackups[index].backups);
    }
  }
  public proccessFilter(index = 0) {
    let temp = [];
    this.userBackups[index].backups.forEach((back) => {
      if (back.id_backup != 0) {

        let bnd = true;
        for (let k in this.userBackups[index].filtrosSearch) {
          if (this.userBackups[index].filtrosSearch[k].isFilter) {
            if (k == "automatic" && this.userBackups[index].filtrosSearch[k].value != "-1") {
              if (back[k].toString() != this.userBackups[index].filtrosSearch[k].value) {
                bnd = false;
                break;
              }
            } else {
              if (k == "date_creation" || k == "date_download") {
                let date = "";
                this.userBackups[index].filtrosSearch[k].value.toLocaleDateString().split("/").reverse().forEach((d) => {
                  date += ((d.length == 1) ? "0" + d : d) + "-";
                });
                date = date.substring(0, date.length - 1);
                if (!back[k].toString().includes(date)){
                  bnd = false;
                  break;
                }
              } else {
                if (!back[k].toString().includes(this.userBackups[index].filtrosSearch[k].value)){
                  bnd = false;
                  break;
                }
              }
            }
          }
        }

        if (bnd) {
          temp.push(back);
        }
      }
    });
    this.userBackups[index].backupsFiltro = [];
    this.userBackups[index].backupsFiltro = this.userBackups[index].backupsFiltro.concat(temp);
    temp = null;
  }
  public isFilter(index = 0): boolean {
    for (let key in this.userBackups[index].filtrosSearch) {
      if (this.userBackups[index].filtrosSearch[key].isFilter) return true;
    }
    return false;
  }

  // -------------------------------- Filter Backups users --------------------------------


  public actualizarBackup(backup, id_usuario): Observable<any> {
    const  parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append('backup', JSON.stringify(backup));
    //return this.http.post(URL + "actualizarBackup", {params: {backup: JSON.stringify(backup)}});
    return this.http.post(URL + "actualizarBackup", parametro);
  }
  public eliminarBackup(id_usuario): Observable<any> {
    /*const  parametro = new HttpParams()
      .append('id', id);*/
    return this.http.delete(URL + 'eliminarBackup', {params: {id_usuario: id_usuario, id_backup: this.userBackups[this.indexUser].id_BackupSelected.toString()}});
  }
  public buscarBackupsUserEmail(email, pagina, order = "desc"): Observable<any> {
    return this.http.get(URL + 'buscarBackupsUserEmail', {params: {email: email, pagina: pagina, orderby: order}});
  }
  public buscarBackupsUserId(idUser, pagina, order = "desc"): Observable<any> {
    //this.backups = [];
    return this.http.get(URL + 'buscarBackupsUserId', {params: {idUser: idUser, pagina: pagina, orderby: order}});
  }

  public buscarBackupsUserMnt(email, cantidad): Observable<any> {
    // this.userBackups = [];
    return this.http.get(URL + 'buscarBackupsUserMnt', {params: {email: email, cantidad: cantidad, pagina: this.pagina.toString()}});
  }
  public buscarUsersExportacionBackups(email): Observable<any> {
    // this.userBackups = [];
    return this.http.get(URL + 'buscarUsersExportacionBackups', {params: {email: email, pagina: this.pagina.toString()}});
  }
  public obtSizeTable(Tabla, id_usuario): Observable<any> {
    return this.http.get(URL + 'obtSizeTable' + Tabla, {params: {id_usuario: id_usuario}});
  }


  public corregirInconsistencia(Tabla, id_usuario): Observable<any> {
    return this.http.get(URL + 'corregirInconsistenciaDatos' + Tabla, {params: {id_usuario: id_usuario}});
  }
  public limpiarBackups(idUser, email, rango , cantidad):Observable<any> {
    const param = (email == "Generales") ? {idUser: idUser, rango: rango} : {idUser: idUser, email: email , rango: rango, cantidad: cantidad};
    return this.http.delete(URL + 'limpiarBackups', {params : param});
  }
  public limpiarBackupsUsers(users, rangoBackups, id_usuario): Observable<any> {
    return this.http.delete(URL + "limpiarBackupsUsers", {params: {id_usuario: id_usuario, users: JSON.stringify(users), rangoBackups: rangoBackups}});
  }
  public exportBackup(type, id_backup, id_usuario): Observable<any> {
    return this.http.get(URL + "exportarBackup", {params: {id_usuario: id_usuario, id_backup: id_backup, typeExport: type}});
  }
}
