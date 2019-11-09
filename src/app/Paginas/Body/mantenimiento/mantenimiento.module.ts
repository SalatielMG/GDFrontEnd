import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { BackupsComponent } from './backups/backups.component';
import { MantenimientoComponent } from './mantenimiento.component';
import {FormsModule} from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {LoadingSpinnerModule} from '../../../Components/loading-spinner/loading-spinner/loading-spinner.module';
import {QueryCompleteModule} from '../../../Components/query-complete/query-complete.module';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {InconsistenciaModule} from './inconsistencia/inconsistencia.module';

@NgModule({
  declarations: [MantenimientoComponent, BackupsComponent],
  imports: [
    NgxSpinnerModule,
    FontAwesomeModule,
    InfiniteScrollModule,
    LoadingSpinnerModule,
    FormsModule,
    CommonModule,
    MantenimientoRoutingModule,
    QueryCompleteModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    InconsistenciaModule],
})
export class MantenimientoModule { }
