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

  public obtPermisosGral(): Observable<any> {
    return this.http.get(URL + 'obtPermisosGral');
  }
  public resetVariables() {
    this.Permisos = [];
    this.UsuariosGal = [];
    this.indexPermisoSelected = 0;
  }
  public agregarPermiso(permiso, userSelected): Observable<any> {
    const  parametro = new HttpParams()
      .append('permiso', JSON.stringify(permiso))
      .append('userSelected', JSON.stringify(userSelected));
    return this.http.post(URL + "agregarPermiso", parametro);
  }
  public actualizarPermiso(permiso, permisoSelected, isChangeUsers): Observable<any> {
    const  parametro = new HttpParams()
      .append('permiso', JSON.stringify(permiso))
      .append('permisoSelected', JSON.stringify(permisoSelected))
      .append('isChangeUsers', JSON.stringify(isChangeUsers));
    return this.http.post(URL + "actualizarPermiso", parametro);
  }
  public eliminarPermiso(permiso): Observable<any> {
    return this.http.delete(URL + "eliminarPermiso", {params: {permiso: JSON.stringify(permiso)}});
  }
  public actuaizarUsuarios_Permiso(isChangeUsers): Observable<any> {
    const  parametro = new HttpParams()
      .append('isChangeUsers', JSON.stringify(isChangeUsers));
    return this.http.post(URL + 'actualizarUsuarios_Permiso', parametro);
  }
}
