import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BackupsComponent} from './backups/backups.component';
import {InconsistenciaComponent} from './inconsistencia/inconsistencia.component';
import {MantenimientoComponent} from './mantenimiento.component';

const routes: Routes = [
  {path: "", component: MantenimientoComponent, children:[
      {path: "backupsMnt", component: BackupsComponent},
      {path: "inconsistenciaMnt", component: InconsistenciaComponent}
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }
