import { Component, OnInit } from '@angular/core';
import { PreferencesService } from '../../../../Servicios/preferences/preferences.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Utilerias} from '../../../../Utilerias/Util';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Preferences} from '../../../../Modelos/preferences/preferences';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

  public option = "";
  public preference: FormGroup = null;
  public indexUniquePreferenceSelected= {};

  constructor( public route: ActivatedRoute,
               public router: Router, public preferencesService: PreferencesService,  public util: Utilerias, public formBuilder: FormBuilder) {
    this.route.parent.paramMap.subscribe(params => {
      this.preferencesService.id_backup = this.util.numberFormat(params.get("idBack"));
      this.preferencesService.resetVariables();
      this.searchPreferences();
    });
  }

  ngOnInit() {
  }
  public onScroll() {
    if (this.preferencesService.isFilter() && !this.util.loadingMain) this.searchPreferences();
  }

  public searchPreferences() {
    this.util.loadingMain = true;
    if (this.preferencesService.pagina == 0) {
      this.util.msjLoading = "Buscando Preferences del Respaldo con id_backup: " + this.preferencesService.id_backup;
      this.util.crearLoading().then(() => {
        this.preferencesService.buscarPreferencesBackup().subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error)
        });
      });
    } else {
      this.preferencesService.buscarPreferencesBackup().subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  public resultado(result) {
    this.util.msj = result.msj;
    if (this.preferencesService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.preferencesService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.preferences.length < this.util.limit;

      }
      this.preferencesService.pagina += 1;
      this.preferencesService.Preferences = this.preferencesService.Preferences.concat(result.preferences);
    } else {
      this.util.QueryComplete.isComplete = this.preferencesService.pagina != 0;
    }
    this.util.loadingMain = false;
  }
  public accionPreference(option, preference = new Preferences(), i = null) {
    this.option = option;
    this.buildForm(preference);
    if (this.option != this.util.AGREGAR) {
      this.indexUniquePreferenceSelected["id_backup"] = preference.id_backup;
      this.indexUniquePreferenceSelected["key_name"] = preference.key_name;
      this.preferencesService.indexPreferenceSelected = i;
      if (this.preferencesService.isFilter()) {
        this.preferencesService.indexPreferenceSelected = <number> this.preferencesService.Preferences.indexOf(preference);
        this.preferencesService.indexPreferenceFilterSelected = i;
      }
    }
    setTimeout(() => {
      this.util.abrirModal("#modalPreference");
    }, 500);
  }
  public buildForm(preference: Preferences) {
    this.preference = this.formBuilder.group({
      id_backup : [preference.id_backup, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("10"))]],
      key_name : [preference.key_name, [Validators.required, Validators.maxLength(30)]],
      value : [preference.value, [Validators.required, Validators.maxLength(50)]],
    });
    if (this.util.isDelete(this.option)) this.disableForm();
  }
  public getError(controlName: string): string {
    let error = '';
    const control = this.preference.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      console.log("Error Control:=[" + controlName + "]", control.errors);
      error = this.util.hasError(control);
    }
    return error;
  }
  public disableForm() {
    for (let key in this.preference.getRawValue()) {
      this.preference.get(key).disable();
    }
    this.preference.disable();
  }
  public closeModal() {
    this.util.cerrarModal("#modalPreference").then(() => {
      console.log("Modal cerrado :v");
      this.option = "";
      this.preference = null;
    });
  }
  public operation() {
    console.log("this.valuepreferenceForm:=", this.preference.value);
    switch (this.option) {
      case this.util.AGREGAR:
        this.agregarPreference();
        break;
      case this.util.ACTUALIZAR:
        this.actualizarPreference();
        break;
      case this.util.ELIMINAR:
        this.eliminarPreference();
        break;
    }
  }
  public agregarPreference () {
    this.preference.patchValue({id_backup: this.preferencesService.id_backup});
    this.util.msjLoading = "Preference con key_name: " + this.preference.value.key_name + " del Respaldo con id_backup: " + this.preferencesService.id_backup;
    this.util.crearLoading().then(() => {
      this.preferencesService.agregarPreference(this.preference.value).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (this.util.QueryComplete.isComplete || this.preferencesService.Preferences.length == 0) {
            if (!result.preference.error) {
              this.preferencesService.Preferences.push(result.preference.new);
              if (this.preferencesService.isFilter()) this.preferencesService.proccessFilter();
            } else {
              this.util.msjToast(result.preference.msj, this.util.errorRefreshListTable, result.preference.error);
            }
          }
         this.closeModal();
        }
      }, error => {this.util.msjErrorInterno(error);})
    });
  }
  public actualizarPreference () {
    this.util.msjLoading = "Preference con key_name: " + this.indexUniquePreferenceSelected["key_name "] + " del Respaldo con id_backup: " + this.preferencesService.id_backup;
    this.util.crearLoading().then(() => {
      this.preferencesService.actualizarPreference(this.preference.value, this.indexUniquePreferenceSelected).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (!result.preference.error) {
            if (this.preferencesService.isFilter()) {
              if (this.preferencesService.indexPreferenceSelected != -1) this.preferencesService.Preferences[this.preferencesService.indexPreferenceSelected] = result.preference.update;
              this.preferencesService.preferencesFilter[this.preferencesService.indexPreferenceFilterSelected] = result.preference.update;
            } else {
              this.preferencesService.Preferences[this.preferencesService.indexPreferenceSelected] = result.preference.update;
            }
          } else {
            this.util.msjToast(result.preference.msj, this.util.errorRefreshListTable, result.preference.error);
          }
         this.closeModal();
        }
      }, error => {this.util.msjErrorInterno(error);})
    });
  }
  public eliminarPreference () {
    this.util.msjLoading = "Preference con key_name: " + this.indexUniquePreferenceSelected[".key_name"] + " del Respaldo con id_backup: " + this.preferencesService.id_backup;
    this.util.crearLoading().then(() => {
      this.preferencesService.eliminarPreference(this.indexUniquePreferenceSelected).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (this.preferencesService.isFilter()) {
            if (this.preferencesService.indexPreferenceSelected != -1) this.preferencesService.Preferences.splice(this.preferencesService.indexPreferenceSelected, 1);
            this.preferencesService.preferencesFilter.splice(this.preferencesService.indexPreferenceFilterSelected, 1);
          } else {
            this.preferencesService.Preferences.splice(this.preferencesService.indexPreferenceSelected, 1);
          }
         this.closeModal();
        }
      }, error => {this.util.msjErrorInterno(error);})
    });
  }
}
