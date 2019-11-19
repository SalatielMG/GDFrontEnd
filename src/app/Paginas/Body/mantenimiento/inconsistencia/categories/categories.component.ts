import { Component } from '@angular/core';
import {CategoriesService} from '../../../../../Servicios/categories/categories.service';
import {Utilerias} from '../../../../../Utilerias/Util';
import {ActivatedRoute, Router} from "@angular/router";
import {Categories} from '../../../../../Modelos/categories/categories';
import {UsuarioService} from '../../../../../Servicios/usuario/usuario.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

  public categorySelected: Categories = new Categories();
  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public categoriesService: CategoriesService, public util: Utilerias, private usuarioService: UsuarioService) {
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
    if (!this.util.loadingMain) this.buscarInconsistencia();
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
        this.util.QueryComplete.isComplete = result.categories.length < this.util.limit_Inconsistencia;
      }
      this.categoriesService.pagina += 1;
      this.categoriesService.Categories = this.categoriesService.Categories.concat(result.categories);
    } else {
      this.util.QueryComplete.isComplete = true;
    }
    this.util.loadingMain = false;
  }
  public accionCorregirRegistro(category: Categories, index) {
    this.categoriesService.indexCategorySelected = index;
    this.categorySelected = category;
    this.util.abrirModal("#modalCategory");
  }
  public corregirInconsistenciaRegistro() {
    let category: any = {};
    category["id_backup"] = this.categorySelected.id_backup;
    category["id_category"] = this.categorySelected.id_category;
    category["id_account"] = this.categorySelected.id_account;
    category["name"] = this.categorySelected.name;
    category["sign"] = this.categorySelected.sign;
    this.util.msjLoading = "Corrigiendo inconsistencias del registro Category con " + this.util.key_Names(category);
    this.util.crearLoading().then(() => {
      this.categoriesService.corregirInconsistenciaRegistro(category, this.usuarioService.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          if (!result.category.error) {
            this.categoriesService.Categories[this.categoriesService.indexCategorySelected] = result.category.categories[0];
          } else {
            this.categoriesService.Categories[this.categoriesService.indexCategorySelected]["repeated"] = 1;
          }
          this.util.cerrarModal("#modalCategory");
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
}
