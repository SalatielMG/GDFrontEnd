import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../../../Utilerias/Util';
import {MovementsService} from '../../../../../Servicios/movements/movements.service';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css']
})
export class MovementsComponent implements OnInit {

  public msj;

  constructor(private movementsService: MovementsService, private util: Utilerias) {
    this.msj = 'Buscando inconsistencia de datos en la tabla Movements';
    this.util.crearLoading().then(() => {
      this.movementsService.inconsistenciaDatos(this.util.emailUserMntInconsistencia).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          this.movementsService.Movements = result.movements;
        }
      }, error => {
        this.util.detenerLoading();
        this.util.msjErrorInterno(error);
      });
    });
  }

  ngOnInit() {
  }

}
