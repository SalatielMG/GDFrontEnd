import { Injectable } from '@angular/core';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Usuarios} from '../../Modelos/usuarios/usuarios';
import {Permisos} from '../../Modelos/permisos/Permisos';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public url = URL;
  public isSesionOpen: boolean = false;
  public usuarioCurrent: Usuarios = null;
  public Usuarios: Usuarios[] = [];
  public PermisosGral: Permisos[] = [];
  public indexUsuarioSelected: number = 0;

  public Headers = new HttpHeaders({'Content-Type':  'application/json'});

  constructor(public http: HttpClient, private router: Router) {
    this.cargarStorage();
  }

  public resetVariables() {
    this.Usuarios = [];
  }

  public activo(): boolean {
    return this.isSesionOpen;
  }

  public isValidTipoUser(tipo: string): boolean {
    return (this.usuarioCurrent.tipo == tipo);
  }

  public isValidPermiso(permiso: string): boolean {
    if (this.usuarioCurrent == null || this.usuarioCurrent.permisos.length == 0) return false;
    let bnd: boolean = false;
    this.usuarioCurrent.permisos.forEach(p => {
      if (p.id.toString() == permiso) bnd = true;
    });
    return bnd;
  }
  public cargarStorage() {
    let isSesionOpen = localStorage.getItem('isSesionOpen');
    let usuarioCurrent = localStorage.getItem('usuarioCurrent');
    this.isSesionOpen = (!(isSesionOpen == "false" || isSesionOpen == null));
    this.usuarioCurrent = null;
    if (this.isSesionOpen)
      this.usuarioCurrent = JSON.parse(usuarioCurrent);
    this.printVariables();
  }
  private printVariables() {
    console.log("isSesionOpen", this.isSesionOpen);
    console.log("usuarioCurrent", this.usuarioCurrent);
  }
  public actualizarStorage() {
    if (!this.isSesionOpen) this.usuarioCurrent = null;
    localStorage.setItem('isSesionOpen', String(this.isSesionOpen));
    localStorage.setItem("usuarioCurrent", JSON.stringify(this.usuarioCurrent));
  }

  public logout() {
    this.isSesionOpen = false;
    this.actualizarStorage();
    this.cargarStorage();
    this.router.navigate(['/login']);
  }

  public login(data): Observable<any> {
    console.log(data);
    const  parametro = new HttpParams()
      .append('data', JSON.stringify(data));
    return this.http.post(URL + 'login', parametro);
  }
  public obtenerUsuario(): Observable <any> {
    return this.http.post(URL + "obtUsuario", new HttpParams().append("id_usuario", this.usuarioCurrent.id.toString()));
  }
  public obtUsuariosGral(id_usuario = "0", show_permiso = "1"): Observable<any> {
    return this.http.get(URL + "obtUsuariosGral", {params: {id_usuario: id_usuario, show_permiso: show_permiso}});
  }
  public agregarUsuario(usuario, isChange , imagen, permisosSelected): Observable <any> {
    const  parametro = new FormData();
      parametro.append('id_usuario', this.usuarioCurrent.id.toString());
      parametro.append('usuario', JSON.stringify(usuario));
      parametro.append('isChange', isChange);
      parametro.append('imagen', imagen);
      parametro.append('permisosSelected', JSON.stringify(permisosSelected));
    return this.http.post(URL + "agregarUsuario", parametro);
  }
  public actualizarUsuario(usuario, isChange , imagen, usuarioSelected, isChangePermisos): Observable <any> {
    const parametro = new FormData();
    parametro.append('id_usuario', this.usuarioCurrent.id.toString());
    parametro.append('usuario', JSON.stringify(usuario));
      parametro.append('isChange', isChange);
      parametro.append('imagen', imagen);
      parametro.append('usuarioSelected', JSON.stringify(usuarioSelected));
      parametro.append('isChangePermisos', JSON.stringify(isChangePermisos));
    return this.http.post(URL + "actualizarUsuario", parametro);
  }
  public UpdateProfile(usuarioProfile, usuarioCurrent): Observable<any> {
    const parametro = new HttpParams().append("usuarioProfile", JSON.stringify(usuarioProfile))
      .append("usuarioCurrent", JSON.stringify(usuarioCurrent));
    return this.http.post(URL + "UpdateProfile", parametro);
  }
  public UpdatePassword(newPassword, ): Observable<any> {
    const parametro = new HttpParams()
      .append("newPassword", newPassword)
      .append("id_usuario", this.usuarioCurrent.id.toString());
    return this.http.post(URL + "UpdatePassword", parametro);
  }
  public UpdateImage(isChange, imagen): Observable<any> {
    const parametro = new FormData();
    parametro.append('isChange', isChange);
    parametro.append('imagen', imagen);
    parametro.append('id_usuario', this.usuarioCurrent.id.toString());
    return this.http.post(URL + "UpdateImage", parametro);
  }
  public eliminarUsuario(usuarioSelected): Observable <any> {
    return this.http.delete(URL + "eliminarUsuario", {params: {usuarioSelected: JSON.stringify(usuarioSelected), id_usuario: this.usuarioCurrent.id.toString()}});
  }
  public actualizarPermisos_Usuario(isChangePermisos): Observable<any> {
    const  parametro = new HttpParams()
      .append('isChangePermisos', JSON.stringify(isChangePermisos));
    return this.http.post(URL + "actualizarPermisos_Usuario", parametro);
  }

  public verifyPasswordCurrent(password): Observable<any> {
    return this.http.get(URL + "verifyPasswordCurrent", {params: { password: password, id_usuario: this.usuarioCurrent.id.toString()}});
  }

  public verifyEmailAndSendCode(email): Observable<any> {
    return this.http.get(URL + "verifyEmailAndSendCode", {params: { email: email}});
  }

  public verifyCodeResetPasword(code, email): Observable<any> {
    return this.http.get(URL + "verifyCodeResetPasword", {params: { code: code, email:email}});
  }

  public ResetPassword(newPassword, email): Observable<any> {
    const  parametro = new HttpParams()
      .append('newPassword', newPassword)
      .append('email', email);
    return this.http.post(URL + "ResetPassword", parametro);
  }

}
