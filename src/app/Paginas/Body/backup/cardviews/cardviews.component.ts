import { Component, OnInit } from '@angular/core';
import { CardviewsService } from '../../../../Servicios/cardviews/cardviews.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Utilerias} from '../../../../Utilerias/Util';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Cardviews} from '../../../../Modelos/cardviews/cardviews';

@Component({
  selector: 'app-cardviews',
  templateUrl: './cardviews.component.html',
  styleUrls: ['./cardviews.component.css']
})
export class CardviewsComponent implements OnInit {

  private option: string = "";
  private cardview: FormGroup = null;
  private indexUniqueAutomaticSelected = {};

  constructor( private route: ActivatedRoute,
               private router: Router, private cardviewService: CardviewsService, private util: Utilerias, private formBuider: FormBuilder) {
    this.route.parent.paramMap.subscribe(params => {
      this.cardviewService.id_backup = parseInt(params.get("idBack"));
      this.cardviewService.resetVariables();
      this.searchCardViews();
    });
  }
  ngOnInit() {
  }
  private onScroll() {
    if (!this.cardviewService.isFilter() && !this.util.loadingMain) this.searchCardViews();
  }
  private searchCardViews() {
    this.util.loadingMain = true;
    if (this.cardviewService.pagina == 0) {
      this.util.msjLoading = "Buscando Cardviews del Respaldo con id_backup: " + this.cardviewService.id_backup;
      this.util.crearLoading().then(() => {
        this.cardviewService.buscarCardviewsBackup().subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.cardviewService.buscarCardviewsBackup().subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  private resultado(result){
    this.util.msj = result.msj;
    if (this.cardviewService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.cardviewService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.cardviews.length < this.util.limit;
        if (!result.cardviewsBackup.error) {
          this.cardviewService.CadViewsGralBackup = result.cardviewsBackup.cardviews;
        } else {
          this.util.msjToast(result.cardviewsBackup.msj, "", result.cardviewsBackup.error);
        }
      }
      this.cardviewService.pagina += 1;
      this.cardviewService.Cardviews = this.cardviewService.Cardviews.concat(result.cardviews);
    } else {
      this.util.QueryComplete.isComplete = this.cardviewService.pagina != 0;
    }
    this.util.loadingMain = false;
  }
  private accionCardview(option, cardview = new Cardviews(), i = null) {
    this.option = option;
    this.buildForm(cardview);
    if (this.option != this.util.AGREGAR) {
      this.indexUniqueAutomaticSelected["id_backup"] = cardview.id_backup;
      this.indexUniqueAutomaticSelected["id_card"] = cardview.id_card;
      this.cardviewService.indexCardviewSelected = i;
      if (this.cardviewService.isFilter()) {
        this.cardviewService.indexCardviewSelected = <number> this.cardviewService.Cardviews.indexOf(cardview);
        this.cardviewService.indexCardviewFilterSelected = i;
      }
    }
    setTimeout(() => {
      this.util.abrirModal("#modalCardview");

    }, 500);
  }
  private buildForm(cardview: Cardviews) {
    this.cardview = this.formBuider.group({
      id_backup : [cardview.id_backup, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("10"))]],
      id_card : [cardview.id_card, [Validators.required, Validators.min(0)]],
      name : [cardview.name, [Validators.required, Validators.maxLength(50)]],
      period : [cardview.period, [Validators.required, Validators.maxLength(40)]],
      sign : [cardview.sign, [Validators.required, Validators.maxLength(1)]],
      show_card : [this.util.valueChecked(cardview.show_card), [Validators.required]],
      number : [cardview.number, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("4"))]],
    });
    if (this.util.isDelete(this.option)) this.disableForm();
  }
  private getError(controlName: string): string {
    let error = '';
    const control = this.cardview.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      console.log("Error Control:=[" + controlName + "]", control.errors);
      error = this.util.hasError(control);
    }
    return error;
  }
  private disableForm() {
    for (let key in this.cardview.getRawValue()) {
      this.cardview.get(key).disable();
    }
    this.cardview.disable();
  }
  private closeModal() {
    this.util.cerrarModal("#modalCardview").then(() => {
      console.log("Modal cerrado :v");
      this.option = "";
      this.cardview = null;
    });
  }
  private operation() {
    console.log("this.valueCategoriesForm:=", this.cardview.value);
    switch (this.option) {
      case this.util.AGREGAR:
        this.agregarCardview();
        break;
      case this.util.ACTUALIZAR:
        this.actualizarCardview();
        break;
      case this.util.ELIMINAR:
        this.eliminarCardview();
        break;
    }
  }
  public agregarCardview() {
    this.patchValueFormDataBeforeOperation();
    this.util.msjLoading = "Agregando la Cardview con con id_card: " + this.cardview.value.id_card + " del Rspaldo con id_backup: " + this.cardviewService.id_backup;
    this.util.crearLoading().then(() => {
      this.cardviewService.agregarCardview(this.cardview.value).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (this.util.QueryComplete.isComplete || this.cardviewService.Cardviews.length == 0){
            if (!result.cardview.error) {
              this.cardviewService.Cardviews.push(result.cardview.new);
              if (this.cardviewService.isFilter()) this.cardviewService.proccessFilter();
            } else {
              this.util.msjToast(result.cardview.msj, result.util.errorRefreshListTable, result.cardview.error);
            }
          }
          if (!result.cardviewsBackup.error) {
            this.cardviewService.CadViewsGralBackup = result.cardviewsBackup.cardviews;
          } else {
            console.log(result.cardviewsBackup);
          }
          this.closeModal();
        } else {
          this.patchValueFormDataAfterOperationError();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });

    });
  }
  public actualizarCardview() {
    this.patchValueFormDataBeforeOperation();
    this.util.msjLoading = "Agregando la Cardview con con id_card: " + this.cardview.value.id_card + " del Rspaldo con id_backup: " + this.cardviewService.id_backup;
    this.util.crearLoading().then(() => {
      this.cardviewService.actualizarCardview(this.cardview.value, this.indexUniqueAutomaticSelected).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (!result.cardview.error) {
            if (this.cardviewService.isFilter()) {
              if (this.cardviewService.indexCardviewSelected != -1) this.cardviewService.Cardviews[this.cardviewService.indexCardviewSelected] = result.cardview.update;
              this.cardviewService.cardviewsFilter[this.cardviewService.indexCardviewFilterSelected] = result.cardview.update;
            } else {
              this.cardviewService.Cardviews[this.cardviewService.indexCardviewSelected] = result.cardview.update;
            }
          } else {
            this.util.msjToast(result.cardview.msj, result.cardview.titulo, result.cardview.error);
          }
          if (!result.cardviewsBackup.error) {
            this.cardviewService.CadViewsGralBackup = result.cardviewsBackup.cardviews;
          } else {
            console.log(result.cardviewsBackup);
          }
          this.closeModal();
        } else {
          this.patchValueFormDataAfterOperationError();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });

    });
  }
  public eliminarCardview() {
    this.util.msjLoading = "Agregando la Cardview con con id_card: " + this.cardview.value.id_card + " del Rspaldo con id_backup: " + this.cardviewService.id_backup;
    this.util.crearLoading().then(() => {
      this.cardviewService.eliminarCardview(this.indexUniqueAutomaticSelected).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (this.cardviewService.isFilter()) {
            if (this.cardviewService.indexCardviewSelected != -1) this.cardviewService.Cardviews.splice(this.cardviewService.indexCardviewSelected, 1);
            this.cardviewService.cardviewsFilter.splice(this.cardviewService.indexCardviewFilterSelected, 1);
          } else {
            this.cardviewService.Cardviews.splice(this.cardviewService.indexCardviewSelected, 1);
          }
          if (!result.cardviewsBackup.error) {
            this.cardviewService.CadViewsGralBackup = result.cardviewsBackup.cardviews;
          } else {
            console.log(result.cardviewsBackup);
          }
          this.closeModal();
        } else {
          this.patchValueFormDataAfterOperationError();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });

    });
  }
  private patchValueFormDataBeforeOperation () {
    this.cardview.patchValue({id_backup: this.cardviewService.id_backup});
    this.cardview.patchValue({sign: this.util.signValue(this.cardview.value.sign)});
    this.cardview.patchValue({show_card: this.util.unValueChecked(this.cardview.value.show_card)});
  }
  private patchValueFormDataAfterOperationError () {
    this.cardview.patchValue({sign: this.util.signUnvalue(this.cardview.value.sign)});
    this.cardview.patchValue({show_card: this.util.valueChecked(this.cardview.value.show_card)});
  }
}
