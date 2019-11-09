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
  public id;
  public UsuarioCurrent: Usuarios = null;
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

  public prueba() {
    let storage = localStorage.getItem('id');
    console.log('Valor actual del storage', storage);
    console.log('Valor actual del id', this.id);
  }
  public activo(): boolean {
    if (this.id == null) return false;
    return (this.id.toString() != "" );
  }
  public isSuperAdmin(): boolean {
    return (this.UsuarioCurrent.tipo == "superAdmin");
  }
  public isAdmin(): boolean {
    return (this.UsuarioCurrent.tipo == "admin");
  }
  public isAux(): boolean {
    return (this.UsuarioCurrent.tipo == "aux");
  }
  public cargarStorage() {
    let id = localStorage.getItem('id');
    let usuario = localStorage.getItem('usuario');
    this.id = id;
    this.UsuarioCurrent = JSON.parse(usuario);
    this.printVariables();
  }
  private printVariables() {
    console.log("id", this.id);
    console.log("UsuarioCurrent", this.UsuarioCurrent);
  }
  public actualizarStorage() {
    localStorage.setItem('id', this.id);
    localStorage.setItem("usuario", JSON.stringify(this.UsuarioCurrent));
  }

  public logout() {
    this.id = "";
    this.UsuarioCurrent = null;
    this.actualizarStorage();
    this.cargarStorage();
    this.router.navigate(['/login']);
  }

  public pass(): Observable<any> {
    return this.http.get(URL + "contraseña");
  }

  public login(data): Observable<any> {
    console.log(data);
    const  parametro = new HttpParams()
      .append('data', JSON.stringify(data));
    return this.http.post(URL + 'login', parametro);
  }

  public obtUsuariosGral(id_usuario = "0", show_permiso = "1"): Observable<any> {
    return this.http.get(URL + "obtUsuariosGral", {params: {id_usuario: id_usuario, show_permiso: show_permiso}});
  }
  public agregarUsuario(usuario, isChange , imagen, permisosSelected): Observable <any> {
    const  parametro = new FormData();
      parametro.append('usuario', JSON.stringify(usuario));
      parametro.append('isChange', isChange);
      parametro.append('imagen', imagen);
      parametro.append('permisosSelected', JSON.stringify(permisosSelected));
    return this.http.post(URL + "agregarUsuario", parametro);
  }
  public actualizarUsuario(usuario, isChange , imagen, usuarioSelected, isChangePermisos): Observable <any> {
    const parametro = new FormData();
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
      .append("id_usuario", this.UsuarioCurrent.id.toString());
    return this.http.post(URL + "UpdatePassword", parametro);
  }
  public UpdateImage(isChange, imagen): Observable<any> {
    const parametro = new FormData();
    parametro.append('isChange', isChange);
    parametro.append('imagen', imagen);
    parametro.append('id_usuario', this.UsuarioCurrent.id.toString());
    return this.http.post(URL + "UpdateImage", parametro);
  }
  public eliminarUsuario(usuarioSelected): Observable <any> {
    return this.http.delete(URL + "eliminarUsuario", {params: {usuarioSelected: JSON.stringify(usuarioSelected)}});
  }
  public actualizarPermisos_Usuario(isChangePermisos): Observable<any> {
    const  parametro = new HttpParams()
      .append('isChangePermisos', JSON.stringify(isChangePermisos));
    return this.http.post(URL + "actualizarPermisos_Usuario", parametro);
  }

  public verifyPasswordCurrent(password): Observable<any> {
    return this.http.get(URL + "verifyPasswordCurrent", {params: { password: password, id_usuario: this.UsuarioCurrent.id.toString()}});
  }

}
