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

  private pagina: number = 0;
  private backups;

  constructor(private route: ActivatedRoute,
              private router: Router, private extrasService: ExtrasService, private util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      console.log(this.backups);
      console.log("params", params);
      this.resetearVariables();
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
  private resetearVariables(){
    this.extrasService.Extras = [];
    this.pagina = 0;
  }
  private buscarInconsistencia() {
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
  private resultado(result, bnd = true) {
    if (bnd) {
      this.util.detenerLoading();
      this.util.msjLoading =  result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.extrasService.Extras = this.extrasService.Extras.concat(result.extras);
    }
    this.util.loadingMain = false;
  }

}
