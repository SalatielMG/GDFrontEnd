import { Component } from '@angular/core';
import { CurrenciesService } from '../../../../Servicios/currencies/currencies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Utilerias } from '../../../../Utilerias/Util';
import {Currencies} from '../../../../Modelos/currencies/currencies';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UsuarioService} from '../../../../Servicios/usuario/usuario.service';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent {

  public option = "";
  public currency: FormGroup = null;
  public indexUniqueCurrencySelected= {};
  public indexCurrencySelectModal: number = 0;

  constructor(public usuarioServicio: UsuarioService, public route: ActivatedRoute,
               public router: Router, public currenciesService: CurrenciesService, public util: Utilerias, public formBuilder: FormBuilder) {

    this.route.parent.paramMap.subscribe(params => {
      this.currenciesService.id_backup = this.util.numberFormat(params.get("idBack"));
      this.currenciesService.resetVariables();
      this.searchCurrencies();
    });
  }

  public onScroll() {
    if (this.currenciesService.isFilter() && !this.util.loadingMain) {
      this.searchCurrencies();
    }
  }
  public searchCurrencies() {
    this.util.loadingMain = true;
    if (this.currenciesService.pagina == 0) {
      this.util.msjLoading = 'Buscando Currencies del Respaldo con id_backup: ' + this.currenciesService.id_backup;
      this.util.crearLoading().then(() => {
        this.currenciesService.buscarCurrenciesBackup().subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.currenciesService.buscarCurrenciesBackup().subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  public resultado(result) {
    this.util.msj = result.msj;
    if (this.currenciesService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.currenciesService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.currencies.length < this.util.limit;
        if (!result.curreciesGralBackup.error) {
          this.currenciesService.CurrenciesGralBackup = result.curreciesGralBackup.currencies;
        } else {
          this.util.msjToast(result.curreciesGralBackup.msj, "", result.curreciesGralBackup.error);
        }
      }
      this.currenciesService.pagina += 1;
      this.currenciesService.Currencies  = this.currenciesService.Currencies.concat(result.currencies);
    } else {
      this.util.QueryComplete.isComplete = this.currenciesService.pagina != 0;
    }
    this.util.loadingMain = false;
  }
  public accionCurrency(option, currency = new Currencies(), i = null) {
    this.util.msjLoading = "";
    this.util.crearLoading().then(() => {
      this.currenciesService.obtCurrenciesGralBackup().subscribe(result => {
        if (!result.error) {
          this.currenciesService.CurrenciesGralBackup = result.currencies;
          this.option = option;
          this.buildForm(currency);
          if (this.option != this.util.OPERACION_AGREGAR) {
            this.indexUniqueCurrencySelected["id_backup"] = currency.id_backup;
            this.indexUniqueCurrencySelected["iso_code"] = currency.iso_code;
            this.indexUniqueCurrencySelected["symbol"] = currency.symbol;
            this.currenciesService.indexCurrencySelected = i;
            if (this.currenciesService.isFilter()) {
              this.currenciesService.indexCurrencySelected = <number> this.currenciesService.Currencies.indexOf(currency);
              this.currenciesService.indexCurrencyFilterSelected = i;
            }
            this.currenciesService.CurrenciesGralBackup.forEach((c, index) => {
              if (c.iso_code.toString() == currency.iso_code.toString()){
                this.indexCurrencySelectModal = index + 1;
              }
            });
          }
          setTimeout(() => {
            this.util.detenerLoading();
            this.util.abrirModal("#modalCurrency");
          }, this.util.timeOutMilliseconds);
        } else {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error)
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  public buildForm(currency: Currencies) {
    this.currency = this.formBuilder.group({
      id_backup : [currency.id_backup, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("10"))]],
      iso_code : [currency.iso_code, [Validators.required, Validators.maxLength(3), Validators.minLength(3)]],
      symbol : [currency.symbol, [Validators.required, Validators.maxLength(5)]],
      icon_name : [currency.icon_name, [Validators.maxLength((20))]],
      selected : [this.util.valueChecked(currency.selected), [Validators.required]],
    });
    if (this.util.isDelete(this.option)) this.disableForm();
  }
  public getError(controlName: string): string {
    let error = '';
    const control = this.currency.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      error = this.util.hasError(control);
    }
    return error;
  }
  public disableForm() {
    for (let key in this.currency.getRawValue()) {
      this.currency.get(key).disable();
    }
    this.currency.disable();
  }
  public closeModal() {
    this.util.cerrarModal("#modalCurrency").then(() => {
      this.option = "";
      this.currency = null;
    });
  }
  public operation() {
    switch (this.option) {
      case this.util.OPERACION_AGREGAR:
        this.agregarCurrency();
        break;
      case this.util.OPERACION_ACTUALIZAR:
        this.actualizarCurrency();
        break;
      case this.util.OPERACION_ELIMINAR:
        this.eliminarCurrency();
        break;
    }
  }
  public agregarCurrency () {
    this.patchValueFormDataBeforeOperation();
    this.util.msjLoading = "Agregando Currency con iso_code: " + this.currency.value.iso_code + " del Respaldo con id_backup: " + this.currenciesService.id_backup;
    this.util.crearLoading().then(() => {
      this.currenciesService.agregarCurrency(this.currency.value, this.usuarioServicio.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {

          if (this.util.QueryComplete.isComplete || this.currenciesService.Currencies.length >= 0) {
            if (!result.currency.error) {
              this.currenciesService.Currencies.push(result.currency.new);
              if (this.currenciesService.isFilter()) this.currenciesService.proccessFilter();
            } else {
              this.util.msjToast(result.currency.msj, this.util.errorRefreshListTable, result.currency.error);
            }
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
  public actualizarCurrency () {
    this.patchValueFormDataBeforeOperation();
    this.util.msjLoading = "Actualizando Currency con iso_code: " + this.indexUniqueCurrencySelected["iso_code"] + " del Respaldo con id_backup: " + this.currenciesService.id_backup;
    this.util.crearLoading().then(() => {
      this.currenciesService.actualizarCurrency(this.currency.value, this.indexUniqueCurrencySelected, this.usuarioServicio.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (!result.currency.error) {
            if (this.currenciesService.isFilter()) {
              if (this.currenciesService.indexCurrencySelected != -1) this.currenciesService.Currencies[this.currenciesService.indexCurrencySelected] = result.currency.update;
              this.currenciesService.currenciesFilter[this.currenciesService.indexCurrencyFilterSelected] = result.currency.update;
            } else {
              this.currenciesService.Currencies[this.currenciesService.indexCurrencySelected] = result.currency.update;
            }
          } else {
            this.util.msjToast(result.currency.msj, this.util.errorRefreshListTable, result.currency.error);
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
  public eliminarCurrency () {
    this.util.msjLoading = "Eliminando Currency con iso_code: " + this.indexUniqueCurrencySelected["iso_code"] + " del Respaldo con id_backup: " + this.currenciesService.id_backup;
    this.util.crearLoading().then(() => {
      this.currenciesService.eliminarCurrency(this.indexUniqueCurrencySelected, this.usuarioServicio.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (this.currenciesService.isFilter()) {
            if (this.currenciesService.indexCurrencySelected != -1 ) this.currenciesService.Currencies.splice(this.currenciesService.indexCurrencySelected, 1);
            this.currenciesService.currenciesFilter.splice(this.currenciesService.indexCurrencyFilterSelected, 1);
          } else {
            this.currenciesService.Currencies.splice(this.currenciesService.indexCurrencySelected, 1);
          }
          this.closeModal();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  public patchValueFormDataBeforeOperation() {
    this.currency.patchValue({id_backup: this.currenciesService.id_backup});
    this.currency.patchValue({selected: this.util.unValueChecked(this.currency.value.selected)});
  }
  public patchValueFormDataAfterOperationError() {
    this.currency.patchValue({selected: this.util.valueChecked(this.currency.value.selected)});
  }
  public currencySelectedModal (event){
    this.indexCurrencySelectModal = event.target.selectedIndex;
    this.currency.patchValue({symbol: ((this.currency.value.iso_code == '') ? "": this.currenciesService.CurrenciesGralBackup[this.indexCurrencySelectModal - 1].symbol)});
    this.currency.patchValue({icon_name: ((this.currency.value.iso_code == '') ? "": this.currenciesService.CurrenciesGralBackup[this.indexCurrencySelectModal - 1].icon_name)});
  }
}
