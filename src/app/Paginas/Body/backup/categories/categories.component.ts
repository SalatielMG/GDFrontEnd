import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../../../Servicios/categories/categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Utilerias} from '../../../../Utilerias/Util';
import {FormGroup} from '@angular/forms';
import {Categories} from '../../../../Modelos/categories/categories';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  private option: string = "";
  private category: FormGroup = null;
  private indexUniqueCategorySelected = {};

  constructor( private route: ActivatedRoute,
               private router: Router, private categoriesService: CategoriesService,  private util: Utilerias) {
    this.route.parent.paramMap.subscribe(params => {
      this.categoriesService.id_backup = params.get("idBack");
      this.categoriesService.resetVariables();
      this.searchCategories();
    });
  }

  ngOnInit() {
  }

  private onScroll() {
    this.searchCategories();
  }
  private searchCategories() {
    this.util.loadingMain = true;
    if (this.categoriesService.pagina == 0) {
      this.util.msjLoading = 'Buscando Categorias del Respaldo con id_backup: ' + this.categoriesService.id_backup;
      this.util.crearLoading().then(() => {
        this.categoriesService.buscarCategoriesBackup().subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.categoriesService.buscarCategoriesBackup().subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  private resultado(result) {
    this.util.msj = result.msj;
    if (this.categoriesService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.categoriesService.Categories = this.categoriesService.Categories.concat(result.categories);
      this.util.QueryComplete.isComplete = false;

      if (this.categoriesService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.categories.length < this.util.limit;
      }
      this.categoriesService.pagina += 1;
      if (!result.accountsBackup.error) {
        this.categoriesService.AccountsBackup = result.accountsBackup.accounts;
      } else {
        this.util.msjToast(result.accountsBackup.msj, "", result.accountsBackup.error);
      }
    } else {
      this.util.QueryComplete.isComplete = this.categoriesService.pagina != 0;
    }
    this.util.loadingMain = false;
  }

  public accionCategory(option, category = new Categories(), i = null) {

  }
}
