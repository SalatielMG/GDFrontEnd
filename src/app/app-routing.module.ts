import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './Paginas/Body/home/home.component';
import { BackupsComponent } from './Paginas/Body/backups/backups.component';
import { LoginComponent } from './Paginas/Body/login/login.component';
import { PaginaNoEmcontradaComponent } from './Paginas/Body/pagina-no-emcontrada/pagina-no-emcontrada.component';
import { UsuarioService } from './Servicios/usuario/usuario.service';
import {PerfilComponent} from './Paginas/Body/usuarios/perfil/perfil.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'perfil', component: PerfilComponent},
  { path: 'home', component: HomeComponent,  canActivate: [UsuarioService]},
  { path: 'backups', component: BackupsComponent, canActivate: [UsuarioService]},
  { path: 'detalleRespaldo/:numBack/:idBack', canActivate: [UsuarioService], loadChildren: () => import('./Paginas/Body/backup/backup.module').then(m => m.BackupModule)},
  { path: 'detalleUsuario', canActivate: [UsuarioService], loadChildren: () => import('./Paginas/Body/detalle-usuario/detalle-usuario.module').then(m => m.DetalleUsuarioModule)},
  { path: 'usuarios', canActivate: [UsuarioService], loadChildren: () => import('./Paginas/Body/usuarios/usuarios.module').then(m => m.UsuariosModule)},
  { path: 'exportacion', canActivate: [UsuarioService], loadChildren: () => import('./Paginas/Body/exportacion/exportacion.module').then(m => m.ExportacionModule)},
  { path: 'mantenimiento', canActivate: [UsuarioService], loadChildren: () => import('./Paginas/Body/mantenimiento/mantenimiento.module').then(m => m.MantenimientoModule)},
  { path: '**', component: PaginaNoEmcontradaComponent},
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
