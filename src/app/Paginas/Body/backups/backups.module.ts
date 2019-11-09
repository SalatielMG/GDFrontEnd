import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackupsRoutingModule } from './backups-routing.module';
import {BackupsComponent} from './backups.component';
import {TituloEncabezadoModule} from '../../Header/titulo-encabezado/titulo-encabezado.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgxSpinnerModule} from 'ngx-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {LoadingSpinnerModule} from '../../../Components/loading-spinner/loading-spinner/loading-spinner.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {QueryCompleteModule} from '../../../Components/query-complete/query-complete.module';
import {BackupModule} from '../backup/backup.module';
import {DetalleUsuarioModule} from '../detalle-usuario/detalle-usuario.module';


@NgModule({
  declarations: [
    BackupsComponent
  ],
  imports: [
    InfiniteScrollModule,
    CommonModule,
    BackupsRoutingModule,
    TituloEncabezadoModule,
    FontAwesomeModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    LoadingSpinnerModule,
    QueryCompleteModule,
    BackupModule,
    DetalleUsuarioModule
  ]
})
export class BackupsModule { }
