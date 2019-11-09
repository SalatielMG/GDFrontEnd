import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BackupsComponent} from './backups.component';


const routes: Routes = [
  { path: '', component: BackupsComponent},
  { path: 'detalleRespaldo/:numBack/:idBack', loadChildren: () => import('../backup/backup.module').then(m => m.BackupModule)},
  { path: 'detalleUsuario', loadChildren: () => import('../detalle-usuario/detalle-usuario.module').then(m => m.DetalleUsuarioModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackupsRoutingModule { }
