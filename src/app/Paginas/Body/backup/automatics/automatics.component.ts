import { Component, OnInit } from '@angular/core';
import { AutomaticsService } from '../../../../Servicios/automatics/automatics.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Utilerias} from '../../../../Utilerias/Util';

@Component({
  selector: 'app-automatics',
  templateUrl: './automatics.component.html',
  styleUrls: ['./automatics.component.css']
})
export class AutomaticsComponent implements OnInit {
  public msj;

  constructor( private route: ActivatedRoute,
               private router: Router, private aumtomaticService: AutomaticsService, private util: Utilerias) {
    this.route.parent.paramMap.subscribe(params => {
      this.msj = 'Buscando Automatics relacionados con el backup';
      this.util.crearLoading().then(() => {
        this.aumtomaticService.buscarAutomaticsBackup(params.get('idBack')).subscribe(
          result => {
            this.util.detenerLoading();
            this.util.msjToast(result.msj, result.titulo, result.error);
            if (!result.error) {
              this.aumtomaticService.Automatics = result.automatics;
            }
          },
          error => {
            this.util.detenerLoading();
            this.util.msjErrorInterno(error);
          }
        );
      });
      console.log('Valor de id Backup', params.get('idBack'));
      // this.idBack = params.get('idBack');
    });
  }

  ngOnInit() {
  }

}
