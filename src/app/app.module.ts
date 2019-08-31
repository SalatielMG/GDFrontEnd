import { BrowserModule } from '@angular/platform-browser';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import localeEs from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs);

import { AppRoutingModule } from './app-routing.module';

/*Dependencias*/
import { ToastrModule } from 'ngx-toastr';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";
import { ChartsModule } from 'ng2-charts';

/*Componentes*/
import { AppComponent } from './app.component';
import { TituloEncabezadoComponent } from './Paginas/Header/titulo-encabezado/titulo-encabezado.component';
import { LoginComponent } from './Paginas/Body/login/login.component';
import { NavEncodeComponent } from './Paginas/Header/nav-encode/nav-encode.component';
import { EncodeMXComponent } from './Paginas/Body/encode-mx/encode-mx.component';
import { BackupsComponent } from './Paginas/Body/backups/backups.component';

/*Servicios*/
import { UsuarioService } from './Servicios/Usuario/usuario.service';
import { UserService } from './Servicios/user/user.service';
import { BackupService } from './Servicios/backup/backup.service';

/*Utilerias*/
import { Utilerias } from './Utilerias/Util';

import { PaginaNoEmcontradaComponent } from './Paginas/Body/pagina-no-emcontrada/pagina-no-emcontrada.component';
import { BackupModule } from './Paginas/Body/backup/backup.module';
import { DetalleUsuarioModule } from './Paginas/Body/detalle-usuario/detalle-usuario.module';
import { MantenimientoModule } from './Paginas/Body/mantenimiento/mantenimiento.module';
import { ExportacionModule } from './Paginas/Body/exportacion/exportacion.module';
import { UsuariosModule } from './Paginas/Body/usuarios/usuarios.module';

@NgModule({
  declarations: [
    AppComponent,
    TituloEncabezadoComponent,
    LoginComponent,
    NavEncodeComponent,
    EncodeMXComponent,
    BackupsComponent,
    PaginaNoEmcontradaComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true
    }),
    NgxSpinnerModule, ChartsModule, MantenimientoModule, ExportacionModule, UsuariosModule, BackupModule, DetalleUsuarioModule, AppRoutingModule
  ],
  providers: [
    DatePipe,
    CurrencyPipe,
    Utilerias,
    UsuarioService,
    UserService,
    BackupService,
    { provide: LOCALE_ID, useValue: 'es-MX' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
