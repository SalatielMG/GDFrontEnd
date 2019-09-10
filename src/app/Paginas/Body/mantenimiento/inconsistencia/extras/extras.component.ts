import { Component, OnInit } from '@angular/core';
import {ExtrasService} from '../../../../../Servicios/extras/extras.service';
import {Utilerias} from '../../../../../Utilerias/Util';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.css']
})
export class ExtrasComponent implements OnInit {

  public msj;
  private pagina: number = 0;

  constructor(private extrasService: ExtrasService, private util: Utilerias) {
    this.resetearVariables();
    this.buscarInconsistencia();
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
    this.util.loading = true;
    if (this.pagina == 0) {
      this.msj = 'Buscando inconsistencia de datos en la tabla Extras';
      this.util.crearLoading().then(() => {
        this.extrasService.inconsistenciaDatos(this.util.emailUserMntInconsistencia, this.pagina).subscribe(result => {
          this.resultado(result)
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.extrasService.inconsistenciaDatos(this.util.emailUserMntInconsistencia, this.pagina).subscribe(result => {
        this.resultado(result, false)
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  private resultado(result, bnd = true) {
    if (bnd) {
      this.util.detenerLoading();
      this.msj =  result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.extrasService.Extras = this.extrasService.Extras.concat(result.extras);
    }
    this.util.loading = false;
  }

}
