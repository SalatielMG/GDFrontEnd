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

  constructor(private extrasService: ExtrasService, private util: Utilerias) {
    this.msj = 'Buscando inconsistencia de datos en la tabla Extras';
    this.util.crearLoading().then(() => {
      this.extrasService.inconsistenciaDatos(this.util.emailUserMntInconsistencia).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          this.extrasService.Extras = result.extras;
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
