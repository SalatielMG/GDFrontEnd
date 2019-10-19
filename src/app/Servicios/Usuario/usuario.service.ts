import { Injectable } from '@angular/core';
import { URL } from '../../Utilerias/URL';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router, ActivatedRoute, ParamMap, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService implements CanActivate{
  public id;

  public Headers = new HttpHeaders({'Content-Type':  'application/json'});
  constructor(public http: HttpClient, private route: ActivatedRoute,
              private router: Router) {
    this.cargarStorage();
  }

  public login(data): Observable<any> {
    console.log(data);
    const  parametro = new HttpParams()
      .append('data', JSON.stringify(data));
    return this.http.post(URL + 'login', parametro);
  }

  public prueba() {
    let storage = localStorage.getItem('id');

    console.log('Valor actual del storage', storage);
    console.log('Valor actual del id', this.id);
  }

  public activo(): boolean {
    // console.log('Valor de id en method activ()', this.id);
    if (this.id == "null") return false; else return true;
  }
  public cargarStorage() {
    let storage = localStorage.getItem('id');
    this.id = storage;
    console.log(storage);
  }

  public actualizarStorage() {
    localStorage.setItem('id', this.id);
  }

  public logout() {
    this.id = null;
    this.actualizarStorage();
    this.cargarStorage();
    this.router.navigate(['/login'])

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.activo()) {
      return true;
    }
    // navigate to login page
    this.router.navigate(['/login']);
    // you can save redirect url so after authing we can move them back to the page they requested
    return false;
  }
  public pass(): Observable<any> {
    return this.http.get(URL + "contraseña");
  }

}
