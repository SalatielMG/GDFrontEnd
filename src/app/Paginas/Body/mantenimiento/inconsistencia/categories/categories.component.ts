import { Component } from '@angular/core';
import {CategoriesService} from '../../../../../Servicios/categories/categories.service';
import {Utilerias} from '../../../../../Utilerias/Util';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public categoriesService: CategoriesService, public util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla Categories";
        return;
      }
      this.categoriesService.resetVariables();
      this.buscarInconsistencia();
    });
  }

  public onScroll() {
    if (!this.categoriesService.isFilter() && !this.util.loadingMain) this.buscarInconsistencia();
  }
  public buscarInconsistencia() {
    this.util.loadingMain = true;
    if (this.categoriesService.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Categories';
      this.util.crearLoading().then(() => {
        this.categoriesService.inconsistenciaDato(this.util.userMntInconsistencia, this.backups).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.categoriesService.inconsistenciaDato(this.util.userMntInconsistencia, this.backups).subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  public resultado(result) {
    this.util.msj = result.msj;
    if (this.categoriesService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.categoriesService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.categories.length < this.util.limit;
      }
      this.categoriesService.pagina += 1;
      this.categoriesService.Categories = this.categoriesService.Categories.concat(result.categories);
    } else {
      this.util.QueryComplete.isComplete = this.categoriesService.pagina != 0;
    }
    this.util.loadingMain = false;
  }
}
