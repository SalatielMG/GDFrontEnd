import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { BackupsComponent } from './backups/backups.component';
import { MantenimientoComponent } from './mantenimiento.component';
import {FormsModule} from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [MantenimientoComponent, BackupsComponent],
  imports: [NgxSpinnerModule,NgbCollapseModule,FontAwesomeModule,
    FormsModule,
    CommonModule,
    MantenimientoRoutingModule
  ]
})
export class MantenimientoModule { }
