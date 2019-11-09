import { Component, OnInit } from '@angular/core';
import {ExtrasService} from '../../../../../Servicios/extras/extras.service';
import {Utilerias} from '../../../../../Utilerias/Util';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.css']
})
export class ExtrasComponent implements OnInit {

  public pagina: number = 0;
  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public extrasService: ExtrasService, public util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      this.resetearVariables();
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla Extras";
        return;
      }
      this.buscarInconsistencia();
    });
  }

  ngOnInit() {
    this.util.ready();
  }
  onScroll () {
    console.log('scrolled!!');
    this.buscarInconsistencia();
  }
  public resetearVariables(){
    this.extrasService.Extras = [];
    this.pagina = 0;
  }
  public buscarInconsistencia() {
    this.util.loadingMain = true;
    if (this.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Extras';
      this.util.crearLoading().then(() => {
        this.extrasService.inconsistenciaDatos(this.util.userMntInconsistencia, this.pagina, this.backups).subscribe(result => {
          this.resultado(result)
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.extrasService.inconsistenciaDatos(this.util.userMntInconsistencia, this.pagina, this.backups).subscribe(result => {
        this.resultado(result, false)
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  public resultado(result, bnd = true) {
    if (bnd) {
      this.util.detenerLoading();
      this.util.msjLoading =  result.msj;
      this.util.msj =  result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.extrasService.Extras = this.extrasService.Extras.concat(result.extras);
    }
    this.util.loadingMain = false;
  }

}
