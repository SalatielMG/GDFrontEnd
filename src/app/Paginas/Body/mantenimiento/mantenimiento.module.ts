import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { BackupsComponent } from './backups/backups.component';
import { MantenimientoComponent } from './mantenimiento.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [MantenimientoComponent, BackupsComponent],
  imports: [FormsModule,
    CommonModule,
    MantenimientoRoutingModule
  ]
})
export class MantenimientoModule { }
