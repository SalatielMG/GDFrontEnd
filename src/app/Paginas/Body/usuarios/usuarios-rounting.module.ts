import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UsuariosComponent} from './usuarios.component';
import {PermisosComponent} from './permisos/permisos.component';

const routes: Routes = [
  {path: "", component: UsuariosComponent},
  {path: "permisos", component: PermisosComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
