import { Component, OnInit } from '@angular/core';
import {UsuarioService} from '../../../Servicios/Usuario/usuario.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CurrenciesService} from '../../../Servicios/currencies/currencies.service';
import {Utilerias} from '../../../Utilerias/Util';

@Component({
  selector: 'app-nav-encode',
  templateUrl: './nav-encode.component.html',
  styleUrls: ['./nav-encode.component.css']
})
export class NavEncodeComponent implements OnInit {

  constructor(public userService: UsuarioService, private route: ActivatedRoute,
              private router: Router, private currencyService: CurrenciesService, private util: Utilerias) { }

  ngOnInit() {
  }

  private eventLogo() {
    let ruta = this.router.url.split("/");
    console.log(ruta);
    switch (ruta[1]) {
      case "detalleRespaldo":
        this.router.navigate(["/backups"]);
        break;
      case "detalleUsuario":
        this.router.navigate(["/backups"]);
        break;
      default:
        this.router.navigate(["/home"]);
        break;
    }
  }

  private insertCurrencies() {
    this.util.msjLoading = "Insertando datos en la tabla table_currencies";
    this.util.crearLoading().then(() => {
      this.currencyService.insertCurrencies().subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }

  private generatePass(){
    this.userService.pass().subscribe(result => {
      console.log("resultado", result);

    }, error =>{
      console.log("error", error);
    });
  }

}
