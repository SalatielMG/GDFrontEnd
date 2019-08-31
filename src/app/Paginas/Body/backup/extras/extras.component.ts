import { Component, OnInit } from '@angular/core';
import { ExtrasService } from '../../../../Servicios/extras/extras.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Utilerias} from '../../../../Utilerias/Util';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.css']
})
export class ExtrasComponent implements OnInit {
  public msj;

  constructor( private route: ActivatedRoute,
               private router: Router, private extrasService: ExtrasService, private util: Utilerias) {
    this.route.parent.paramMap.subscribe(params => {
      this.msj = 'Buscando Extras relacionados con el backup';
      this.util.crearLoading().then(() => {
        this.extrasService.buscarExtrasBackup(params.get('idBack')).subscribe(result => {
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
      console.log('Valor de id Backup', params.get('idBack'));
      // this.idBack = params.get('idBack');
    });
  }

  ngOnInit() {
  }

}
