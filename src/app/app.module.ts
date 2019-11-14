import { BrowserModule } from '@angular/platform-browser';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import localeEs from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs);

import { AppRoutingModule } from './app-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

/*Dependencias*/
import { ToastrModule } from 'ngx-toastr';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";
import { ChartsModule } from 'ng2-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

/*Componentes*/
import { AppComponent } from './app.component';
import { NavEncodeComponent } from './Paginas/Header/nav-encode/nav-encode.component';

/*Servicios*/
import { UsuarioService } from './Servicios/usuario/usuario.service';
import { UserService } from './Servicios/user/user.service';
import { BackupService } from './Servicios/backup/backup.service';

/*Utilerias*/
import { Utilerias } from './Utilerias/Util';

import { PaginaNoEmcontradaComponent } from './Paginas/Body/pagina-no-emcontrada/pagina-no-emcontrada.component';
import { MantenimientoModule } from './Paginas/Body/mantenimiento/mantenimiento.module';
import { ExportacionModule } from './Paginas/Body/exportacion/exportacion.module';
import { UsuariosModule } from './Paginas/Body/usuarios/usuarios.module';
import { LoadingSpinnerModule } from './Components/loading-spinner/loading-spinner/loading-spinner.module';
import { QueryCompleteModule } from './Components/query-complete/query-complete.module';
import { TituloEncabezadoModule } from './Paginas/Header/titulo-encabezado/titulo-encabezado.module';
import { LoginModule } from './Paginas/Body/login/login.module';
import { HomeModule } from './Paginas/Body/home/home.module';

@NgModule({
  declarations: [
    AppComponent,
    NavEncodeComponent,
    PaginaNoEmcontradaComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    LoadingSpinnerModule,
    InfiniteScrollModule,
    NgbModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true
    }),
    HomeModule,
    LoginModule,
    UsuariosModule,
    ExportacionModule,
    MantenimientoModule,
    FontAwesomeModule, NgxSpinnerModule, ChartsModule, QueryCompleteModule, TituloEncabezadoModule, AppRoutingModule
  ],
  providers: [
    DatePipe,
    CurrencyPipe,
    Utilerias,
    UsuarioService,
    UserService,
    BackupService,
    { provide: LOCALE_ID, useValue: 'es-MX' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
