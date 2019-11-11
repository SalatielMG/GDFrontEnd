import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from '../../Utilerias/URL';
import {Permisos} from '../../Modelos/permisos/Permisos';
import {Usuarios} from '../../Modelos/usuarios/usuarios';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  public Permisos: Permisos[] = [];
  public UsuariosGal: Usuarios[] = [];
  public indexPermisoSelected: number = 0;

  constructor(public http: HttpClient) { }

  public obtPermisosGral(id_usuario, show_usuario = "1"): Observable<any> {
    return this.http.get(URL + 'obtPermisosGral', {params: {id_usuario: id_usuario, show_usuario: show_usuario}});
  }
  public resetVariables() {
    this.Permisos = [];
    this.UsuariosGal = [];
    this.indexPermisoSelected = 0;
  }
  public agregarPermiso(permiso, userSelected, id_usuario): Observable<any> {
    const  parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append('permiso', JSON.stringify(permiso))
      .append('userSelected', JSON.stringify(userSelected));
    return this.http.post(URL + "agregarPermiso", parametro);
  }
  public actualizarPermiso(permiso, permisoSelected, isChangeUsers, id_usuario): Observable<any> {
    const  parametro = new HttpParams()
      .append('id_usuario', id_usuario)
      .append('permiso', JSON.stringify(permiso))
      .append('permisoSelected', JSON.stringify(permisoSelected))
      .append('isChangeUsers', JSON.stringify(isChangeUsers));
    return this.http.post(URL + "actualizarPermiso", parametro);
  }
  public eliminarPermiso(permisoSelected, id_usuario): Observable<any> {
    return this.http.delete(URL + "eliminarPermiso", {params: {permisoSelected: JSON.stringify(permisoSelected), id_usuario: id_usuario}});
  }
  public actuaizarUsuarios_Permiso(isChangeUsers): Observable<any> {
    const  parametro = new HttpParams()
      .append('isChangeUsers', JSON.stringify(isChangeUsers));
    return this.http.post(URL + 'actualizarUsuarios_Permiso', parametro);
  }
}
