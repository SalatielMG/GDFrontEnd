import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BackupsComponent} from './backups/backups.component';
import {MantenimientoComponent} from './mantenimiento.component';
import {PermisoMntBackupsGuard} from '../../../Validations/Guards/permisoMntBackups/permiso-mnt-backups.guard';
import {PermisoMntInconsistenciaGuard} from '../../../Validations/Guards/permisoMntInconsistencia/permiso-mnt-inconsistencia.guard';

const routes: Routes = [
  {path: '', component: MantenimientoComponent, children:[
      {path: 'backupsMnt', component: BackupsComponent, canActivate: [PermisoMntBackupsGuard]},
      {path: 'inconsistenciaMnt', canActivate: [PermisoMntInconsistenciaGuard], loadChildren: () => import('./inconsistencia/inconsistencia.module').then( m => m.InconsistenciaModule)}
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule {  }
