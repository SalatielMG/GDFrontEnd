import { Component, OnInit } from '@angular/core';
import { CardviewsService } from '../../../../Servicios/cardviews/cardviews.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Utilerias} from '../../../../Utilerias/Util';

@Component({
  selector: 'app-cardviews',
  templateUrl: './cardviews.component.html',
  styleUrls: ['./cardviews.component.css']
})
export class CardviewsComponent implements OnInit {
  public msj;
  constructor( private route: ActivatedRoute,
               private router: Router, private cardviewService: CardviewsService, private util: Utilerias) {
    this.route.parent.paramMap.subscribe(params => {
      this.msj = 'Buscando Cardviews relacionados con el id_backup';
      this.util.crearLoading().then(() => {
        this.cardviewService.buscarCardviewsBackup(params.get('idBack')).subscribe(result => {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error);
          if (!result.error) {
            this.cardviewService.Cardviews = result.cardviews;
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
