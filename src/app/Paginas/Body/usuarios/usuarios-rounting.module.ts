import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UsuariosComponent} from './usuarios.component';
import {PermisosComponent} from './permisos/permisos.component';
import {IsSuperAdminOrAdminGuard} from '../../../Validations/Guards/isSuperAdminOrAdmin/is-super-admin-or-admin.guard';
import {IsSuperAdminGuard} from '../../../Validations/Guards/isSuperAdmin/is-super-admin.guard';

const routes: Routes = [
  {path: '', canActivate: [IsSuperAdminOrAdminGuard], component: UsuariosComponent, children: [
    ]},
  {path: 'permisos', canActivate: [IsSuperAdminGuard], component: PermisosComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
