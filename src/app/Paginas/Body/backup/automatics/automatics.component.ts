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

  private id_backup;

  constructor( private route: ActivatedRoute,
               private router: Router, private automaticService: AutomaticsService, private util: Utilerias) {
    this.route.parent.paramMap.subscribe(params => {
      this.id_backup = params.get("idBack");
      this.automaticService.resetearVarables();
      this.buscarAutomatics();
    });
  }
  private onScroll() {
    if (!this.automaticService.isFilter()) this.buscarAutomatics();
  }
  private buscarAutomatics() {
    this.util.loadingMain = true;
    if (this.automaticService.pagina == 0) {
      this.util.msjLoading = "Buscando registros en la tabla Automatics del backup : " + this.id_backup;
      this.util.crearLoading().then(() => {
        this.automaticService.buscarAutomaticsBackup(this.id_backup).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.automaticService.buscarAutomaticsBackup(this.id_backup).subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  private resultado(result) {
    if (this.automaticService.pagina == 0) { // Primera Busqueda
      this.util.detenerLoading();
      this.util.msj = result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.automaticService.pagina += 1;
      this.automaticService.Automatics = this.automaticService.Automatics.concat(result.automatics);
      this.util.QueryComplete.isComplete = false;
      // console.log("Accounts", this.accountService.Accounts);
    } else {
      this.util.QueryComplete.isComplete = this.automaticService.pagina != 0;
    }
    this.util.loadingMain = false;
  }
  ngOnInit() {
  }

}
