import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

  constructor(public http: HttpClient) { }

  public obtPermisosGral(): Observable<any> {
    return this.http.get(URL + 'obtPermisosGral');
  }
  public resetVariables() {
    this.Permisos = [];
    this.UsuariosGal = [];
  }

}
