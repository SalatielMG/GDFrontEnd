import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { BackupsComponent } from './backups/backups.component';
import { MantenimientoComponent } from './mantenimiento.component';
import {FormsModule} from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ScrollingModule } from '@angular/cdk/scrolling'
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {LoadingSpinnerModule} from '../../../Components/loading-spinner/loading-spinner/loading-spinner.module';

@NgModule({
  declarations: [MantenimientoComponent, BackupsComponent],
  imports: [NgxSpinnerModule, FontAwesomeModule, ScrollingModule, InfiniteScrollModule,LoadingSpinnerModule,
    FormsModule,
    CommonModule,
    MantenimientoRoutingModule,

  ],
})
export class MantenimientoModule { }
