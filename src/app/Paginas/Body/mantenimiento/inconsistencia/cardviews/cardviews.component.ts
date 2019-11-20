import { Component } from '@angular/core';
import {CardviewsService} from '../../../../../Servicios/cardviews/cardviews.service';
import {Utilerias} from '../../../../../Utilerias/Util';
import {ActivatedRoute, Router} from "@angular/router";
import {Cardviews} from '../../../../../Modelos/cardviews/cardviews';
import {UsuarioService} from '../../../../../Servicios/usuario/usuario.service';

@Component({
  selector: 'app-cardviews',
  templateUrl: './cardviews.component.html',
  styleUrls: ['./cardviews.component.css']
})
export class CardviewsComponent {

  public cardviewSelected: any = new Cardviews();
  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public cardviewService: CardviewsService, public util: Utilerias, private usuarioService: UsuarioService) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla CardViews";
        return;
      }
      this.cardviewService.resetVariables();
      this.buscarInconsistencia();
    });
  }
  public onScroll() {
    if (!this.util.loadingMain) this.buscarInconsistencia();
  }
   public buscarInconsistencia(){
    this.util.loadingMain = true;
     if (this.cardviewService.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla CardViews';
      this.util.crearLoading().then(() => {
        this.cardviewService.inconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.cardviewService.inconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }

  }
  public resultado(result) {
    this.util.msj = result.msj;
    if (this.cardviewService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.cardviewService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.cardviews.length < this.util.limit_Inconsistencia;
      }
      this.cardviewService.pagina += 1;
      this.cardviewService.Cardviews = this.cardviewService.Cardviews.concat(result.cardviews);
    } else {
      this.util.QueryComplete.isComplete = true;
    }
    this.util.loadingMain = false;
  }
  public accionCorregirRegistro(cardview: Cardviews, index) {
    this.cardviewService.indexCardviewSelected = index;
    this.cardviewSelected = cardview;
    this.util.abrirModal("#modalCardview");
  }
  public corregirInconsistenciaRegistro() {
    let cardview: any = {};
    cardview["id_backup"] = this.cardviewSelected.id_backup;
    cardview["id_card"] = this.cardviewSelected.id_card;
    this.util.msjLoading = "Corrigiendo inconsistencia del registro Cardview con " + this.util.key_Names(cardview);
    this.util.crearLoading().then(() => {
      this.cardviewService.corregirInconsistenciaRegistro(cardview, this.usuarioService.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          if (!result.cardview.error) {
            this.cardviewService.Cardviews[this.cardviewService.indexCardviewSelected] = result.cardview.cardviews[0];
          } else {
            this.cardviewService.Cardviews[this.cardviewService.indexCardviewSelected]["repeated"] = 1;
          }
          this.util.cerrarModal("#modalCardview");
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }

}
