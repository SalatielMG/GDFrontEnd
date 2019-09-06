import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { BackupsComponent } from './backups/backups.component';
import { MantenimientoComponent } from './mantenimiento.component';
import {FormsModule} from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ScrollingModule } from '@angular/cdk/scrolling'


@NgModule({
  declarations: [MantenimientoComponent, BackupsComponent],
  imports: [NgxSpinnerModule, FontAwesomeModule, ScrollingModule,
    FormsModule,
    CommonModule,
    MantenimientoRoutingModule
  ]
})
export class MantenimientoModule { }
