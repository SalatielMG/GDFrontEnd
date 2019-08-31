import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { BackupsComponent } from './backups/backups.component';
import { InconsistenciaComponent } from './inconsistencia/inconsistencia.component';
import { MantenimientoComponent } from './mantenimiento.component';

@NgModule({
  declarations: [MantenimientoComponent, BackupsComponent, InconsistenciaComponent],
  imports: [
    CommonModule,
    MantenimientoRoutingModule
  ]
})
export class MantenimientoModule { }
