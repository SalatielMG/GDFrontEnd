import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {UsuarioService} from '../../../Servicios/usuario/usuario.service';
import {Utilerias} from '../../../Utilerias/Util';

@Injectable({
  providedIn: 'root'
})
export class IsSuperAdminOrAdminGuard implements  CanActivate{
  constructor(private usuarioService: UsuarioService, private router: Router, private util: Utilerias) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.usuarioService.isValidTipoUser(this.util.SUPERADMIN) || this.usuarioService.isValidTipoUser(this.util.ADMIN)) {
      return true;
    }
    this.util.msjToast("No tiene suficientes privilegios para operar sobre los Usuarios de la Aplicación Web. Porfavor autentiquese con una cuenta que tenga suficientes privilegios", "¡ Error de privilegios !", true);
    this.router.navigate(['/login']);
    return false;
  }

}
