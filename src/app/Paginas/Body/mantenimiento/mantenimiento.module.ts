import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { BackupsComponent } from './backups/backups.component';
import { MantenimientoComponent } from './mantenimiento.component';

@NgModule({
  declarations: [MantenimientoComponent, BackupsComponent],
  imports: [
    CommonModule,
    MantenimientoRoutingModule
  ]
})
export class MantenimientoModule { }
