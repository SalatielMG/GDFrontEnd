import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../../../Utilerias/Util';
import {MovementsService} from '../../../../../Servicios/movements/movements.service';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css']
})
export class MovementsComponent implements OnInit {

  private pagina: number = 0;

  constructor(private movementsService: MovementsService, private util: Utilerias) {
    this.resetearVariables();
    this.buscarInconsistencias();
  }

  ngOnInit() {
    this.util.ready();
  }
  public onScroll() {
    this.buscarInconsistencias();
  }
  private resetearVariables() {
    this.movementsService.Movements = [];
    this.pagina = 0;
  }
  private buscarInconsistencias() {
    this.util.loadingMain = true;
    if (this.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Movements';
      this.util.crearLoading().then(() => {
        this.movementsService.inconsistenciaDatos(this.util.userMntInconsistencia, this.pagina).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.movementsService.inconsistenciaDatos(this.util.userMntInconsistencia, this.pagina).subscribe(result => {
        this.resultado(result, false);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  private resultado(result, bnd =  true) {
    if (bnd) {
      this.util.detenerLoading();
      this.util.msjLoading = result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.movementsService.Movements = this.movementsService.Movements.concat(result.movements);
    }
    this.util.loadingMain = false;
  }

}
