import { Component } from '@angular/core';
import { CategoriesService } from '../../../../Servicios/categories/categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Utilerias} from '../../../../Utilerias/Util';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Categories} from '../../../../Modelos/categories/categories';
import {UsuarioService} from '../../../../Servicios/usuario/usuario.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

  public option: string = "";
  public category: FormGroup = null;
  public indexUniqueCategorySelected = {};
  public indexCategorySelectModal: number = 0;

  constructor(public usuarioServicio: UsuarioService, public route: ActivatedRoute,
               public router: Router, public categoriesService: CategoriesService,  public util: Utilerias, public formBuilder: FormBuilder) {
    this.route.parent.paramMap.subscribe(params => {
      this.categoriesService.id_backup = params.get("idBack");
      this.categoriesService.resetVariables();
      this.searchCategories();
    });
  }

  public onScroll() {
    if (!this.util.QueryComplete.isComplete && !this.categoriesService.isFilter() && !this.util.loadingMain) this.searchCategories();
  }
  public searchCategories() {
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
        if (!result.accountsBackup.error) {
          this.categoriesService.AccountsBackup = result.accountsBackup.accounts;
        } else {
          this.util.msjToast(result.accountsBackup.msj, "", result.accountsBackup.error);
        }
      }
      this.categoriesService.pagina += 1;
      this.categoriesService.Categories = this.categoriesService.Categories.concat(result.categories);
    } else {
      this.util.QueryComplete.isComplete = true;
    }
    this.util.loadingMain = false;
  }

  public accionCategory(option, category = new Categories(), i = null) {
    this.util.msjLoading = "Cargando cuentas del backup: " + this.categoriesService.id_backup;
    this.util.crearLoading().then(() => {
      this.categoriesService.accountsCategoriesServices.obtAccountsBackup(this.categoriesService.id_backup, "0").subscribe(result => {
        if (!result.error) {
          this.categoriesService.AccountsBackup = result.accounts;
          this.option = option;
          this.buildForm(category);
          if (this.option != this.util.OPERACION_AGREGAR) {
            this.indexUniqueCategorySelected["id_backup"]= category.id_backup;
            this.indexUniqueCategorySelected["id_account"]= category.id_account;
            this.indexUniqueCategorySelected["id_category"]= category.id_category;
            this.indexUniqueCategorySelected["name"]= category.name;
            this.indexUniqueCategorySelected["sign"]= this.util.signValue(category.sign);
            this.categoriesService.indexCategorySelected = i;
            if (this.categoriesService.isFilter()) {
              this.categoriesService.indexCategorySelected = <number>this.categoriesService.Categories.indexOf(category);
              this.categoriesService.indexCategoryFilterSelected = i;
            }
            setTimeout( () => {
              this.util.detenerLoading();
              this.util.abrirModal("#modalCategory");
            }, this.util.timeOutMilliseconds);
          } else {
            this.util.detenerLoading();
            this.util.msjLoading = "Calculando nuevo id_category del backup: " + this.categoriesService.id_backup;
            this.util.crearLoading().then(() => {
              this.categoriesService.obtNewId_Category().subscribe(result => {
                if (!result.error) {
                  this.category.patchValue({id_category: result.newId_Category});
                  setTimeout( () => {
                    this.util.detenerLoading();
                    this.util.abrirModal("#modalCategory");
                  }, this.util.timeOutMilliseconds);
                } else {
                  this.util.detenerLoading();
                  this.util.msjToast(result.msj, result.titulo, result.error);
                }
              }, error => {
                this.util.msjErrorInterno(error);
              });
            });
          }
        } else {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error);
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }

  public buildForm(category: Categories) {
    this.category = this.formBuilder.group({
      id_backup : [category.id_backup, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("10"))]],
      id_account : [(this.option == this.util.OPERACION_AGREGAR) ? "":category.id_account, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("5"))]],
      id_category : [category.id_category, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("5"))]],
      name : [category.name, [Validators.required, Validators.maxLength(50)]],
      sign : [category.sign, [Validators.required, Validators.maxLength(1)]],
      icon_name : [category.icon_name, [Validators.maxLength(20)]],
      number : [category.number, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("4"))]],
    });
    if (this.util.isDelete(this.option)) this.disableForm();

  }
  public getError(controlName: string): string {
    let error = '';
    const control = this.category.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      error = this.util.hasError(control);
    }
    return error;
  }
  public disableForm() {
    for (let key in this.category.getRawValue()) {
      this.category.get(key).disable();
    }
    this.category.disable();
  }
  public closeModal() {
    this.util.cerrarModal("#modalCategory").then(() => {
      this.option = "";
      this.category = null;
    });
  }
  public operation() {
    switch (this.option) {
      case this.util.OPERACION_AGREGAR:
        this.agregarCategory();
        break;
      case this.util.OPERACION_ACTUALIZAR:
        this.actualizarCategory();
        break;
      case this.util.OPERACION_ELIMINAR:
        this.eliminarCategory();
        break;
    }
  }
  public agregarCategory() {
    this.category.patchValue({id_backup: this.categoriesService.id_backup});
    this.category.patchValue({sign: this.util.signValue(this.category.value.sign)});
    this.util.msjLoading = "Agregando la nueva categoria con id_category: " + this.category.value.id_category + " del respaldo con id_backup: " + this.categoriesService.id_backup;
    this.util.crearLoading().then(() => {
      this.categoriesService.agregarCategory(this.category.value, this.usuarioServicio.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (this.util.QueryComplete.isComplete) {
            if (!result.category.error) {
              this.categoriesService.Categories.push(result.category.new);
              if (this.categoriesService.isFilter()) this.categoriesService.proccessFilter();
            } else {
              this.util.msjToast(result.category.msj, this.util.errorRefreshListTable, result.category.error);
            }
          }
          this.closeModal();
        } else {
          this.category.patchValue({sign: this.util.signUnvalue(this.category.value.sign)});
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  public actualizarCategory() {
    this.category.patchValue({sign: this.util.signValue(this.category.value.sign)});
    this.util.msjLoading = "Actualizando la categoria con id_category: " + this.category.value.id_category + " del respaldo con id_backup: " + this.categoriesService.id_backup;
    this.util.crearLoading().then(() => {
      this.categoriesService.actualizarCategory(this.category.value, this.indexUniqueCategorySelected, this.usuarioServicio.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (!result.category.error) {
            if (this.categoriesService.isFilter()) {
              if (this.categoriesService.indexCategorySelected != -1) this.categoriesService.Categories[this.categoriesService.indexCategorySelected] = result.category.update;
              this.categoriesService.categoriesFilter[this.categoriesService.indexCategoryFilterSelected] = result.category.update;
            } else {
              this.categoriesService.Categories[this.categoriesService.indexCategorySelected] = result.category.update;
            }
          } else {
            this.util.msjToast(result.category.msj, this.util.errorRefreshListTable, result.category.error);
          }
          this.closeModal();
        } else {
          this.category.patchValue({sign: this.util.signUnvalue(this.category.value.sign)});
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  public eliminarCategory() {
    this.util.msjLoading = "Eliminando la categoria con id_category: " + this.category.value.id_category + " del respaldo con id_backup: " + this.categoriesService.id_backup;
    this.util.crearLoading().then(() => {
      this.categoriesService.eliminarCategory(this.indexUniqueCategorySelected, this.usuarioServicio.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (this.categoriesService.isFilter()) {
            if (this.categoriesService.indexCategorySelected != -1) this.categoriesService.Categories.splice(this.categoriesService.indexCategorySelected, 1);
            this.categoriesService.categoriesFilter.splice(this.categoriesService.indexCategoryFilterSelected, 1);
          } else {
            this.categoriesService.Categories.splice(this.categoriesService.indexCategorySelected,  1);
          }
          this.closeModal();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      })
    })
  }
}
