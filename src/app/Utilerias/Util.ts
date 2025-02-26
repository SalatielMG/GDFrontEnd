import {Injectable} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { faCheck, faKey, faEye, faChevronUp, faChevronDown ,faUserPlus, faCheckSquare ,faList ,faBug ,faCog, faDatabase, faUserCircle ,faFileExport ,faTimesCircle, faArrowUp, faSearch, faPen, faTrash, faSlidersH, faTools, faPlus} from "@fortawesome/free-solid-svg-icons";
import { DatePipe } from '@angular/common';
declare var $: any;

@Injectable()

export class Utilerias {

  /*----- Variables Opciones Operacion ------*/
  public OPERACION_LIMPIARBACKUPSUSERS: string = "Limpiar Backups Usuarios";
  public OPERACION_LIMPIARBACKUPSUSER: string = "Limpiar Backups usuario";
  public OPERACION_CONSULTA: string = "Consulta";
  public OPERACION_AGREGAR: string = "Agregar";
  public OPERACION_ACTUALIZAR: string = "Actualizar";
  public OPERACION_ELIMINAR: string = "Eliminar";
  public OPERACION_EXPORTAR: string = "Exportar";
  /*----- Variables Opciones Operacion ------*/

  /*----- Variables Permisos  ------*/
  public PERMISO_INSERT: string = "1";
  public PERMISO_UPDATE: string = "2";
  public PERMISO_DELETE: string = "3";
  public PERMISO_EXPORT: string = "4";
  public PERMISO_MNTBACKUPS: string = "5";
  public PERMISO_MNTINCONSISTENCIA: string = "6";
  /*----- Variables Permisos  ------*/

  /*----- Variables Tipos de usuarios  ------*/
  public SUPERADMIN: string = "superAdmin";
  public ADMIN: string = "admin";
  public AUX: string = "aux";
  /*----- Variables Tipos de usuarios  ------*/

  public onScroll: boolean = false;

  public QueryComplete = {
    isComplete: false,
    msj: "¡ Consulta completa !"
  };

  public userMntInconsistencia = {
    email: "Generales",
    id: "0",
  };

  public emailUserMntBackup: string = "Generales";
  public emailUserExportacionBackups: string = "Generales";
  public errorRefreshListTable: string = "RECARGA LA PÁGINA";
  public errorMsjEmailNoValido: string = "Porfavor ingrese un correo valido";
  public errorTituloEmailNoValido: string = "Email no Valido";


  public regex_email = /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,4}$/;
  public exprRegular_6Decimal: string = "([0-9]+\.?[0-9]{0,6})";
  public exprRegular_6DecimalNegative: string = "([-]{0,1}?[0-9]+\.?[0-9]{0,6})";
  public exprOperation_Code: string = "([0-9A-Za-z]{15,15})";//(.[0-9]{1,6})?
  public characterAllowInOperationCode: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  public idCardView = [{id: 0}, {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}];
  public Keys_Names_Preferences = [{key_name: "budget_reduce_period"}, {key_name: "week_is_updated"}];
  public nameMonth = [
    {
      value: 1,
      name: 'Enero',
      nameSorth: 'ENE'
    }, {
      value: 2,
      name: 'Febrero',
      nameSorth: 'FEB'
    }, {
      value: 3,
      name: 'Marzo',
      nameSorth: 'MAR'
    }, {
      value: 4,
      name: 'Abril',
      nameSorth: 'ABR'
    }, {
      value: 5,
      name: 'Mayo',
      nameSorth: 'MAY'
    }, {
      value: 6,
      name: 'Junio',
      nameSorth: 'JUN'
    }, {
      value: 7,
      name: 'Julio',
      nameSorth: 'JUL'
    }, {
      value: 8,
      name: 'Agosto',
      nameSorth: 'AGO'
    }, {
      value: 9,
      name: 'Septiembre',
      nameSorth: 'SEP'
    }, {
      value: 10,
      name: 'Octubre',
      nameSorth: 'OCT'
    }, {
      value: 11,
      name: 'Noviembre',
      nameSorth: 'NOV'
    }, {
      value: 12,
      name: 'Diciembre',
      nameSorth: 'DIC'
    },
  ];
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

  public faCheck = faCheck;
  public faKey = faKey;
  public faEye = faEye;
  public faUserPlus = faUserPlus;
  public faCheckSquare = faCheckSquare;
  public faList = faList;
  public faBug = faBug;
  public faCog = faCog;
  public faDatabase = faDatabase;
  public faUserCircle = faUserCircle;
  public faFileExport = faFileExport;
  public faTimesCircle = faTimesCircle;
  public faArrowUp = faArrowUp;
  public faSearch = faSearch;
  public faPlus = faPlus;
  public faTools = faTools;
  public faSlidersH = faSlidersH;
  public faTrash = faTrash;
  public faPen = faPen;
  public faChevronUp = faChevronUp;
  public faChevronDown = faChevronDown;
  public loadingMain: boolean = true;
  public loadingModal: boolean = true;
  public msjModal: string = "";
  public msjLoading: string = "";
  public msj: string = "";
  public stepDecimal: string = "0.000001";
  public limit: number = 50;
  public limit_Inconsistencia: number = 10;
  public timeOutMilliseconds: number = 1000;
  public newPassword: string = "";
  public emailResetPassword: string = "";
  public symbolDecimalNumber6Digits: string = "1.2-6";

  constructor(private toast: ToastrService, private spinnerService: NgxSpinnerService, private datePipe: DatePipe) {
  }

  public nameTipo(tipo) {
    let name = "";
    switch (tipo) {
      case "superAdmin":
        name = "Super Administrador";
        break;
      case "admin":
        name = "Administrador";
        break;
      case "aux":
        name = "Auxiliar";
        break;
    }
    return name;
  }

  public obtisFullHDDisplay(): boolean {
    return window.innerHeight > 768;
  }

  public sumaTotal(arreglo) {
    let total: number = 0;
    for (let data of arreglo) {
      total += this.numberFormat(data);
    }
    return total;
  }

  public formatDatePipe(date, time = " hh:mm:ss") {
    return ((date == "0000-00-00") || (date == "0000-00-00 00:00:00")) ? date : this.datePipe.transform(date, "dd MMMM yyyy" + time);
  }

  public getWeekNumber = function (now: Date) {
    let i = 0, f, sem = (new Date(now.getFullYear(), 0, 1).getDay() > 0) ? 1 : 0;
    while ((f = new Date(now.getFullYear(), 0, ++i)) < now) {
      if (!f.getDay()) {
        sem++;
      }
    }
    return sem;
  };

  public getBiweekNumber(date): number {
    let biweek: number = 0;
    let day: number = date[2];
    let month: number = date[1];
    if (day > 0 && month > 0) {
      month = month - 1;
      biweek = (day >= 1 && day <= 15) ? 1 : 2;
      biweek = biweek + (month * 2);
    }
    return biweek;
  }

  public valueChecked(data: number): boolean {
    return (data != 0);
  }

  public unValueChecked(data: boolean): number {
    return ((data) ? 1 : 0);
  }

  public formatTimeSQL(timer) {
    let time = timer.split(":");
    time.forEach((value, index) => {
      time[index] = (value.length == 1) ? "0" + value : value;
    });
    return time.toString().replace(/,/g, ":");
  }

  public formatComponentDateCalendar(date) {
    return (date != "0000-00-00") ? new Date(date + " 00:00:00") : "";
  }

  public formatComponentTime(date, Time) {
    return new Date(date + " " + Time);
  }

  public formatDateTimeSQL(dataForm, key, isTime = true) {
    let dateTime = "";
    if (dataForm.value[key] != null && dataForm.value[key] != "") {
      dataForm.value[key].toLocaleDateString().split("/").reverse().forEach((d) => {
        dateTime = dateTime + ((d.length == 1) ? "0" + d : d) + "-";
      });
      dateTime = (dateTime.substring(0, dateTime.length - 1)) + ((isTime) ? " " + dataForm.value[key].toLocaleTimeString() : "");
    } else {
      dateTime = "0000-00-00" + ((isTime) ? " 00:00:00" : "");
    }
    return dateTime;
  }

  public randomOperation_Code() {
    let operation_code: string = '';
    let lengthOC: number = this.characterAllowInOperationCode.length;
    for (let i: number = 0; i < 15; i++) {
      operation_code += this.characterAllowInOperationCode.charAt(Math.floor(Math.random() * lengthOC));
    }
    return operation_code;
  }

  public numberFormat(data) {
    return parseInt(data);
  }

  public isDelete(option): boolean {
    return option == this.OPERACION_ELIMINAR;
  }

  public hasError(control) {
    let error = '';
    if (control.hasError("required")) {
      error += "El campo es requerido.\n"
    }
    if (control.hasError("passwordNoVerify")) {
      error += "Contraseña incorrecta";
    }
    if (control.hasError("emailNoVerify")) {
      error += "No existe el correo";
    }
    if (control.hasError("codeNoVerify")) {
      error += "Codigo incorrecto";
    }
    if (control.hasError("NoConfirmNewPassword")) {
      error += "Las contraseñas no coinciden";
    }
    if (control.hasError("email")) {
      error += "Ingrese un email valido\n";
    }
    if (control.hasError("minlength")) {
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
      error = "Campo estricto con digitos y letras del alfabeto [0-9A-Za-z] de longitud exacta de 15 caracteres.";
    } else if (pattern == "^" + this.exprRegular_6Decimal + "$") {
      error = "Campo númerico de no más de 6 decimales.";
    } else if (pattern == "^" + this.exprRegular_6DecimalNegative + "$") {
      error = "Campo númerico de no más de 6 decimales.";
    } else {
      let p = pattern.split(",");
      error = "Longitud máxima permitida de " + p[1][0] + " caracteres";
    }
    return error;
  }

  public signValue(sign) {
    return (sign == "+") ? "1" : "0";
  }

  public signUnvalue(sign) {
    return (sign == "1" ? "+" : "-");
  }

  public reegex_MaxLengthNumber(lenght) {
    return "([0-9]{1," + lenght + "})";
  }

  public zeroFile(dato) {
    let dataString: string = "" + dato;
    if (dataString.includes(".")) {
      let decimalFalt: number = 6 - (dataString.split(".")[1].length);
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

  public calcularColoreAleatorios(length, border = false) {
    if (length <= this.backgroundColor.length) {
      return (border) ? this.borderColor.slice(0, (length)) : this.backgroundColor.slice(0, (length));
    } else {
      let cociente = length / this.backgroundColor.length;
      if (cociente.toString().includes('.')) {
        cociente = parseInt(cociente.toString().slice(0, (cociente.toString().indexOf(".")))) + 1;
      } else {
        cociente = parseInt(cociente.toString()) + 1;
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
    $(window).scroll(function () {
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

  public msjToast(msj, titulo, error) {
    if (error == "warning") {
      this.msjToastWarning(msj, titulo);
      return;
    }
    if (error == "success") {
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
    this.toast.warning(error.message, "¡ " + error.name + " !", {
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
    return new Promise((resolve) => {
      $(modal).modal('hide');
      resolve();
    });
  }

  public abrirModal(modal) {
    $(modal).modal('show');
  }

  public classModal(option): string {
    let classModal = "btn";
    switch (option) {
      case this.OPERACION_ACTUALIZAR:
        classModal += " btn-primary";
        break;
      case this.OPERACION_ELIMINAR:
        classModal += " btn-danger";
        break;
      default:
        classModal += " btn-success";
        break;
    }
    return classModal;
  }

  public compare(array1 = [], array2 = []) {
    array1.sort();
    array2.sort();
    let result = (array1.length == array2.length && array1.every(function (v, i) {
      return v === array2[i]
    }));
    return result;
  }
  public key_Names(object) {
    let result = "";
    for (let index in object) {
      result += index + ": " + object[index] + ", ";
    }
    return (result.substring(0, result.length - 2));
  }
}
