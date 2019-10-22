import { Component, OnInit } from '@angular/core';
import { ExtrasService } from '../../../../Servicios/extras/extras.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Utilerias} from '../../../../Utilerias/Util';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Extras} from '../../../../Modelos/extras/extras';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.css']
})
export class ExtrasComponent implements OnInit {

  private option = "";
  private extra: FormGroup = null;
  private indexUniqueExtrasSelected= {};

  constructor( private route: ActivatedRoute,
               private router: Router, private extrasService: ExtrasService, private util: Utilerias, private formBuilder: FormBuilder) {
    this.route.parent.paramMap.subscribe(params => {
      this.extrasService.id_backup = this.util.numberFormat(params.get("idBack"));
      this.extrasService.resetVariables();
      this.searchExtras();
    });
  }

  ngOnInit() {
  }

  public onScroll() {
    if (this.extrasService.isFilter() && !this.util.loadingMain) {
      this.searchExtras();
    }
  }
  private searchExtras() {
    this.util.loadingMain = true;
    if (this.extrasService.pagina == 0) {
      this.util.msjLoading = "Buscando Extras del Respaldo con id_backup: " + this.extrasService.id_backup;
      this.util.crearLoading().then(() => {
        this.extrasService.buscarExtrasBackup().subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.extrasService.buscarExtrasBackup().subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  private resultado(result) {
    this.util.msj = result.msj;
    if (this.extrasService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.extrasService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.extras.length < this.util.limit;

      }
      this.extrasService.pagina += 1;
      this.extrasService.Extras = this.extrasService.Extras.concat(result.extras);
    } else {
      this.util.QueryComplete.isComplete = this.extrasService.pagina != 0;
    }
    this.util.loadingMain = false;
  }
  private accionExtras(option, extras = new Extras(), i = null) {
    this.option = option;
    this.buildForm(extras);
    if (this.option != this.util.AGREGAR) {
      this.indexUniqueExtrasSelected["id_backup"] = extras.id_backup;
      this.indexUniqueExtrasSelected["id_extra"] = extras.id_extra;
      this.extrasService.indexExtraSelected = i;
      if (this.extrasService.isFilter()) {
        this.extrasService.indexExtraSelected = <number> this.extrasService.Extras.indexOf(extras);
        this.extrasService.indexExtraFilterSelected = i;
      }
    }
    setTimeout(() => {
      this.util.abrirModal("#modalExtra");
    }, 500);
  }
  private buildForm(extra: Extras) {
    this.extra = this.formBuilder.group({
      id_backup : [extra.id_backup, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("10"))]],
      id_extra : [extra.id_extra, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("5"))]],
      account : [extra.account, [Validators.required, Validators.maxLength(50)]],
      category : [extra.category, [Validators.required, Validators.maxLength(50)]],
    });
    if (this.util.isDelete(this.option)) this.disableForm();
  }
  private getError(controlName: string): string {
    let error = '';
    const control = this.extra.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      console.log("Error Control:=[" + controlName + "]", control.errors);
      error = this.util.hasError(control);
    }
    return error;
  }
  private disableForm() {
    for (let key in this.extra.getRawValue()) {
      this.extra.get(key).disable();
    }
    this.extra.disable();
  }
  private closeModal() {
    this.util.cerrarModal("#modalExtra").then(() => {
      console.log("Modal cerrado :v");
      this.option = "";
      this.extra = null;
    });
  }
  private operation() {
    console.log("this.valueExtrasForm:=", this.extra.value);
    switch (this.option) {
      case this.util.AGREGAR:
        this.agregarExtra();
        break;
      case this.util.ACTUALIZAR:
        this.actualizarExtra();
        break;
      case this.util.ELIMINAR:
        this.eliminarExtra();
        break;
    }
  }
  public agregarExtra () {
    this.extra.patchValue({id_backup: this.extrasService.id_backup});
    this.util.msjLoading = "Extra con id_extra: " + this.extra.value.id_extra;
    this.util.crearLoading().then(() => {
      this.extrasService.agregarExtra(this.extra.value).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (this.util.QueryComplete.isComplete || this.extrasService.Extras.length == 0) {
            if (!result.extra.error) {
              this.extrasService.Extras.push(result.extra.new);
              if (this.extrasService.isFilter()) this.extrasService.proccessFilter();
            } else {
              this.util.msjToast(result.extra.msj, this.util.errorRefreshListTable, result.extra.error);
            }
          }
          this.closeModal();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  public actualizarExtra () {
    this.util.msjLoading = "Extra con id_extra: " + this.indexUniqueExtrasSelected["id_extra"];
    this.util.crearLoading().then(() => {
      this.extrasService.actualizarExtra(this.extra.value, this.indexUniqueExtrasSelected).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (!result.extra.error) {
            if (this.extrasService.isFilter()) {
              if (this.extrasService.indexExtraSelected != -1) this.extrasService.Extras[this.extrasService.indexExtraSelected] = result.extra.update;
              this.extrasService.extrasFilter[this.extrasService.indexExtraFilterSelected] = result.extra.update;
            } else {
              this.extrasService.Extras[this.extrasService.indexExtraSelected] = result.extra.update;
            }
          } else {
            this.util.msjToast(result.extra.msj, this.util.errorRefreshListTable, result.extra.error);
          }
          this.closeModal();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  public eliminarExtra () {
    this.util.msjLoading = "Extra con id_extra: " + this.indexUniqueExtrasSelected["id_extra"];
    this.util.crearLoading().then(() => {
      this.extrasService.eliminarExtra(this.indexUniqueExtrasSelected).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (this.extrasService.isFilter()) {
            if (this.extrasService.indexExtraSelected != -1) this.extrasService.Extras.splice(this.extrasService.indexExtraSelected, 1);
            this.extrasService.extrasFilter.splice(this.extrasService.indexExtraFilterSelected, 1);
          } else {
            this.extrasService.Extras.splice(this.extrasService.indexExtraSelected, 1);
          }
          this.closeModal();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
}
