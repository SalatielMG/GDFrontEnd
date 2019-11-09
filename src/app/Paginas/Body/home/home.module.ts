import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import {TituloEncabezadoModule} from '../../Header/titulo-encabezado/titulo-encabezado.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgxSpinnerModule} from 'ngx-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BackupsModule} from '../backups/backups.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    TituloEncabezadoModule,
    FontAwesomeModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    BackupsModule

  ]
})
export class HomeModule { }
