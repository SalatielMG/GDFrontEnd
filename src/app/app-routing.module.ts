import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaginaNoEmcontradaComponent } from './Paginas/Body/pagina-no-emcontrada/pagina-no-emcontrada.component';
import {SessionActiveGuard} from './Validations/Guards/sessionActive/session-active.guard';
import {PerfilComponent} from './Paginas/Body/usuarios/perfil/perfil.component';

const routes: Routes = [
  { path: 'perfil', canActivate: [SessionActiveGuard], component: PerfilComponent},
  { path: 'login', loadChildren: () => import('./Paginas/Body/login/login.module').then(m => m.LoginModule)},
  { path: 'home', canActivate: [SessionActiveGuard], loadChildren: () => import('./Paginas/Body/home/home.module').then(m => m.HomeModule)},
  { path: 'usuarios', canActivate: [SessionActiveGuard], loadChildren: () => import('./Paginas/Body/usuarios/usuarios.module').then(m => m.UsuariosModule)},
  { path: 'exportacion', canActivate: [SessionActiveGuard], loadChildren: () => import('./Paginas/Body/exportacion/exportacion.module').then(m => m.ExportacionModule)},
  { path: 'mantenimiento', canActivate: [SessionActiveGuard], loadChildren: () => import('./Paginas/Body/mantenimiento/mantenimiento.module').then(m => m.MantenimientoModule)},
  { path: '**', component: PaginaNoEmcontradaComponent},
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
