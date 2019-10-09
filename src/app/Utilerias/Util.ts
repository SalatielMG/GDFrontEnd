import {Injectable} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { faCalendar, faArrowDown, faArrowUp, faSearch, faFilter, faArrowLeft, faRecycle, faRedo, faChevronLeft, faPen, faTrash, faSlidersH, faTools, faPlusSquare, faPlus} from "@fortawesome/free-solid-svg-icons";
declare var $: any;

@Injectable()

export class Utilerias {

  public AGREGAR: string = "Agregar";
  public ACTUALIZAR: string = "Actualizar";
  public ELIMINAR: string = "Eliminar";
  public CatTransfer: string = "Trasnferencias";
  public CataAccount_all: string = "Todas las cuentas";
  public CatCategory_all: string = "Todas las categorias";
  public QueryComplete = {
    isComplete:  false,
    msj: "Fin de resultados"
  };

  public userMntInconsistencia = {
    email : "Generales",
    id : "0",
  };

  public emailUserMntBackup = "Generales";
  public errorRefreshListTable = "RECARGA LA PÁGINA";

  public regex_email = /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,4}$/;
  public exprRegular_6Decimal = "([0-9]+\.?[0-9]{0,6})";
  public exprOperation_Code = "([0-9A-Za-z]{15,15})";//(.[0-9]{1,6})?
  public characterAllowInOperationCode = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  public faCalendar = faCalendar;
  public faArrowDown = faArrowDown;
  public faArrowUp = faArrowUp;
  public faSearch = faSearch;
  public faArrowLeft = faArrowLeft;
  public faRecycle = faRecycle;
  public faPlusSquare = faPlusSquare;
  public faPlus = faPlus;
  public faTools = faTools;
  public faSlidersH = faSlidersH;
  public faTrash = faTrash;
  public faPen = faPen;
  public faRedo = faRedo;
  public faChevronLeft = faChevronLeft;
  public faFilter = faFilter;
  public loadingMain: boolean = true;
  public loadingModal: boolean = true;
  public msjModal: string = "";
  public msjLoading: string = "";
  public msj: string = "";
  public stepDecimal: string = "0.000001";
  public limit: number= 50;

  constructor(private toast: ToastrService, private spinnerService: NgxSpinnerService) {
  }

  public formatDateTimeSQL(dataForm, key) {
    let dateTime = "";
    if (dataForm.value[key] != null) {
      dataForm.value[key].toLocaleDateString().split("/").reverse().forEach((d) => {
        dateTime = dateTime + d + "-";
      });
      dateTime = (dateTime.substring(0, dateTime.length - 1)) + " " + dataForm.value[key].toLocaleTimeString();
    } else {
      dateTime = "0000-00-00 00:00:00";
    }
    return dateTime;
  }

  public randomOperation_Code() {
    let operation_code: string = '';
    let lengthOC: number = this.characterAllowInOperationCode.length;
    for ( let i: number = 0; i < 15; i++ ) {
      operation_code += this.characterAllowInOperationCode.charAt(Math.floor(Math.random() * lengthOC));
    }
    return operation_code;
  }

  public numberFormat(data){
    return parseInt(data);
  }
  public isDelete(option): boolean {
    return option == this.ELIMINAR;
  }
  public hasError(control) {
    let error = '';
    if (control.hasError("required")) {
      error += "El campo es requerido.\n"
    }
    if (control.hasError("minLength")) {
      error += "Longitud mínima permitida de " + control.getError("minlength").requiredLength + " caracteres.\n"
    }
    if (control.hasError("maxlength")) {
      error += "Longitud máxima permitida de " + control.getError("maxlength").requiredLength + " caracteres.\n"
    }
    if (control.hasError("min")) {
      error += "Valor númerico mínimo " + control.getError("min").min + ".\n"
    }
    if (control.hasError("pattern")) {
      error += this.errorRegexPatern(control.getError("pattern").requiredPattern) + ".\n"
    }
    return error;
  }
  private errorRegexPatern(pattern) {
    let error = "";
    if (pattern == "^([0-9A-Za-z]{15,15})$") {
      error = "Campo estricto con cualquier Digito númerico y letra del alfabeto [0-9A-Za-z] de 15 caracteres.";
    } else if (pattern == "^([0-9]+.?[0-9]{0,6})$") {
      error = "Campo númerico de no más de 6 decimales.";
    } else {
      let p = pattern.split(",");
      error = "Longitud máxima permitida de " + p[1][0] + " caracteres";
    }
    return error;
  }
  public signValue(sign) {
    return (sign == "+") ? "1" : "0" ;
  }
  public reegex_MaxLengthNumber(lenght) {
    return "([0-9]{1," + lenght + "})";
  }
  public zeroFile(dato) {
    let dataString: string = "" + dato;
    console.log("dataString in zeroFile()", dataString);
    if (dataString.includes(".")) {
      let decimalFalt:number = 6 - (dataString.split(".")[1].length);
      for (let i = 0; i < decimalFalt; i++) {
        dataString += "0";
      }
    } else {
      dataString += ".000000";
    }
    return dataString;
  }
  public unZeroFile(dato) {
    let dataString: string = "" + dato;
    let dataSplit = dataString.split(".");
    if (dataSplit[1] == "000000") {
      return dataSplit[0];
    } else {
      return dato;
    }
  }
  public asignarNombre(id, nombre){
    let name = "";
    switch (id) {
      case "10000":
        name = this.CatTransfer;
        break;
      case "10001":
        name = this.CataAccount_all;
        break;
      case "10002":
        name = this.CatCategory_all;
        break;
      default:
        name = nombre;
        break;
    }
    return name;
  }
  public calcularColoreAleatorios(length, border = false) {
    if (length <= this.backgroundColor.length) {
      return (border) ? this.borderColor.slice(0, (length)) : this.backgroundColor.slice(0, (length));
    } else  {
      let cociente = length / this.backgroundColor.length;
      // console.log('cociente', cociente);
      // let result = 10/2;
      // console.log("Result:= ", result);
      if (cociente.toString().includes('.')) {
        cociente = parseInt(cociente.toString().slice(0, (cociente.toString().indexOf(".")))) + 1;
        // console.log('parseInt(cociente.toString().slice(0, (cociente.toString().indexOf(".") -1))) + 1', cociente);
      } else {
        cociente = parseInt(cociente.toString()) + 1;
        // console.log("cociente = parseInt(cociente.toString()) + 1", cociente);
      }
      return this.ajustarArregloColor(cociente, length, border);
    }
  }
  private ajustarArregloColor(cociente, length, border) {
    let color = [];
    if (border) {
      for (let i = 0; i < cociente; i++) {
        color = color.concat(this.borderColor);
      }
    } else {
      for (let i = 0; i < cociente; i++) {
        color = color.concat(this.backgroundColor);
      }
    }
    return color.slice(0, (length - 1));
  }
  public ready(up = 'right') {
    $('.up-' + up).hide();
    $(window).scroll(function(){
      if ($(this).scrollTop() > 100) {
        $('.up-' + up).fadeIn('1000');
      } else {
        $('.up-' + up).fadeOut('1000');
      }
    });
  }
  public subir() {
    $('body, html').animate({
      scrollTop: 0
    }, 200);
  }
  public backgroundColor = [
    "rgba(128, 0, 128, 0.5)",
    "rgba(255, 0, 255, 0.5)",
    "rgba(0, 0, 128, 0.5)",
    "rgba(0, 0, 255, 0.5)",
    "rgba(0, 128, 128, 0.5)",
    "rgba(0, 255, 255, 0.5)",
    "rgba(0, 128, 0, 0.5)",
    "rgba(0, 255, 0, 0.5)",
    "rgba(128, 128, 0, 0.5)",
    "rgba(255, 255, 0, 0.5)",
    "rgba(128, 0, 0, 0.5)",
    "rgba(255, 0, 0, 0.5)",
    "rgba(0, 0, 0, 0.5)",
    "rgba(128, 128, 128, 0.5)",
    "rgba(192, 192, 192, 0.5)",
    "rgba(205, 205, 205, 0.5)",
  ];
  public borderColor = [
    "rgba(128, 0, 128, 1)",
    "rgba(255, 0, 255, 1)",
    "rgba(0, 0, 128, 1)",
    "rgba(0, 0, 255, 1)",
    "rgba(0, 128, 128, 1)",
    "rgba(0, 255, 255, 1)",
    "rgba(0, 128, 0, 1)",
    "rgba(0, 255, 0, 1)",
    "rgba(128, 128, 0, 1)",
    "rgba(255, 255, 0, 1)",
    "rgba(128, 0, 0, 1)",
    "rgba(255, 0, 0, 1)",
    "rgba(0, 0, 0, 1)",
    "rgba(128, 128, 128, 1)",
    "rgba(192, 192, 192, 1)",
    "rgba(205, 205, 205, 1)",
  ];

  public msjToast(msj, titulo, error) {
    if (error == "warning"){
      this.msjToastWarning(msj, titulo);
      return;
    }
    if (error == "success"){
      this.msjToastSucces(msj, titulo);
      return;
    }
    if (error) {
      this.msjToastError(msj, titulo);
    } else {
      this.msjToastSucces(msj, titulo);
    }
  }

  private msjToastSucces(msj, titulo) {
    this.toast.success(msj, titulo);
  }

  private msjToastError(msj, titulo) {
    this.toast.error(msj, titulo);
  }
  private msjToastWarning(msj, titulo) {
    this.toast.warning(msj, titulo, {
      closeButton: true,
      disableTimeOut: true,
      timeOut: 6000
    });
  }
  public msjErrorInterno(error, detenerLoading = true, loadingMain = true, titulo = '¡ ERROR INTERNO !') {
    if (loadingMain) this.loadingMain = false; else this.loadingModal = false;
    if (detenerLoading) this.detenerLoading();
    console.log(titulo, error);
    this.toast.warning(error, "¡ ERROR INTERNO !", {
      closeButton: true,
      disableTimeOut: true,
      timeOut: 6000,
    });
  }

  public crearLoading() {
    return this.spinnerService.show();
  }

  public detenerLoading() {
    this.spinnerService.hide();
  }

  public cerrarModal(modal) {
    return new Promise((reject) => {
      $(modal).modal('hide');
      reject();
    });
  }

  public abrirModal(modal) {
    return new Promise((reject) => {
      $(modal).modal('show');
      reject();
    });
  }

  public classModal(option): string {
    let classModal = "btn";
    switch (option) {
      case this.AGREGAR:
        classModal += " btn-success";
        break;
      case this.ACTUALIZAR:
        classModal += " btn-primary";
        break;
      case this.ELIMINAR:
        classModal += " btn-danger";
        break;
    }
    return classModal;
  }

}
