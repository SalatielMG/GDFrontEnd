import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {UsuarioService} from '../../../Servicios/usuario/usuario.service';
import {Utilerias} from '../../../Utilerias/Util';

@Injectable({
  providedIn: 'root'
})
export class PermisoMntInconsistenciaGuard implements CanActivate, CanActivateChild {

  constructor(private usuarioService: UsuarioService, private router: Router, private util: Utilerias) {  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log("route local", route);
    console.log("this.router", this.router);
    if (this.usuarioService.isValidPermiso(this.util.PERMISO_MNTINCONSISTENCIA)){
      return true;
    }
    this.util.msjToast("No tiene permiso para operar sobre el submenu Mantenimiento inconsistencia.", "¡ Error de privilegios !", true);
    return false;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log("route local", childRoute);
    console.log("this.router", this.router);
    if (this.usuarioService.isValidPermiso(this.util.PERMISO_MNTINCONSISTENCIA)){
      return true;
    }
    this.util.msjToast("No tiene permiso para operar sobre las opciones del submenu Mantenimiento inconsistencia.", "¡ Error de privilegios !", true);
    return false;
  }
}
