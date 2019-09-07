import {Injectable} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()

export class Utilerias {

  public CatTransfer = "Trasnferencias";
  public CataAccount_all = "Todas las cuentas";
  public CatCategory_all = "Todas las categorias";

  public emailUserMntInconsistencia = "Generales";
  public emailUserMntBackup = "Generales";

  public regex_email = /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,4}$/;

  constructor(private toast: ToastrService, private spinnerService: NgxSpinnerService){
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
    this.toast.error(msj, titulo, );
  }

  public msjErrorInterno(error, titulo = '¡ ERROR INTERNO !') {
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
}
