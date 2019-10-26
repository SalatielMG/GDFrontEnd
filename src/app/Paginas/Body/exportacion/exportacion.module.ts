import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportacionComponent } from './exportacion.component';
import { ExportacionRoutingModule } from './exportacion-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {LoadingSpinnerModule} from '../../../Components/loading-spinner/loading-spinner/loading-spinner.module';
import {FormsModule} from '@angular/forms';
import {QueryCompleteModule} from '../../../Components/query-complete/query-complete.module';

@NgModule({
  declarations: [ExportacionComponent],
  imports: [
    NgxSpinnerModule,
    FontAwesomeModule,
    InfiniteScrollModule,
    LoadingSpinnerModule,
    FormsModule,
    QueryCompleteModule,
    CommonModule,
    ExportacionRoutingModule
  ]
})
export class ExportacionModule { }
