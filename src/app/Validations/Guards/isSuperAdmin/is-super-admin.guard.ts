import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {UsuarioService} from '../../../Servicios/usuario/usuario.service';
import {Utilerias} from '../../../Utilerias/Util';

@Injectable({
  providedIn: 'root'
})
export class IsSuperAdminGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router, private util: Utilerias) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.usuarioService.isSuperAdmin()) {
      return true;
    }
    this.util.msjToast("No tiene suficientes privilegios para operar sobre el submenu Permisos. Porfavor autentiquese como super Administrador.", "¡ Error de privilegios !", true);
    this.router.navigate(['/login']);
    return false;
  }

}
