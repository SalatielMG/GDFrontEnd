import { Component, OnInit } from '@angular/core';
import { MovementsService } from '../../../../Servicios/movements/movements.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Utilerias} from '../../../../Utilerias/Util';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css']
})
export class MovementsComponent implements OnInit {
  public msj;

  constructor( private route: ActivatedRoute,
               private router: Router, private movementsService: MovementsService, private util: Utilerias) {
    this.route.parent.paramMap.subscribe(params => {
      this.msj = 'Buscando Movements relacionados con el id_backup';
      this.util.crearLoading().then(() => {
        this.movementsService.buscarMovementsBackup(params.get('idBack')).subscribe(result => {
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
      console.log('Valor de id Backup', params.get('idBack'));
      // this.idBack = params.get('idBack');
    });
  }

  ngOnInit() {
  }

}
