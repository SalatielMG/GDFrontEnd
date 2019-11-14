import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UsuariosComponent} from './usuarios.component';
import {PermisosComponent} from './permisos/permisos.component';
import {IsSuperAdminOrAdminGuard} from '../../../Validations/Guards/isSuperAdminOrAdmin/is-super-admin-or-admin.guard';
import {IsSuperAdminGuard} from '../../../Validations/Guards/isSuperAdmin/is-super-admin.guard';
import {SessionActiveGuard} from '../../../Validations/Guards/sessionActive/session-active.guard';
import {PerfilComponent} from './perfil/perfil.component';

const routes: Routes = [
  {path: '', canActivate: [IsSuperAdminOrAdminGuard], component: UsuariosComponent, children: [
    ]},
  {path: 'permisos', canActivate: [IsSuperAdminGuard], component: PermisosComponent},
  { path: 'perfil', canActivate: [SessionActiveGuard], component: PerfilComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
