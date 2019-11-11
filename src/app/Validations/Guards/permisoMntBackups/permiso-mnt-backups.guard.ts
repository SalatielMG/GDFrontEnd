import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {UsuarioService} from '../../../Servicios/usuario/usuario.service';
import {Utilerias} from '../../../Utilerias/Util';

@Injectable({
  providedIn: 'root'
})
export class PermisoMntBackupsGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService, private router: Router, private util: Utilerias) {  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.usuarioService.isValidPermiso(this.util.PERMISO_MNTBACKUPS)){
      return true;
    }
    this.util.msjToast("No tiene permiso para operar sobre el submenu Mantenimiento backups.", "¡ Error de privilegios !", true);
    return false;
  }
}
