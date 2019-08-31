import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../Servicios/user/user.service';
import {Utilerias} from '../../../../Utilerias/Util';

@Component({
  selector: 'app-gastos-entradas',
  templateUrl: './gastos-entradas.component.html',
  styleUrls: ['./gastos-entradas.component.css']
})
export class GastosEntradasComponent implements OnInit {
  public year;
  public backup;

  public msj= "";
  public barChartLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData = [
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Gastos'},
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Ingresos'}
  ];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  public TotalbarChartLabels = [''];
  public TotalbarChartType = 'bar';
  public TotalbarChartLegend = true;

  public TotalbarChartData = [
    {data: [0], label: 'Gastos'},
    {data: [0], label: 'Ingresos'}
  ];
  public TotalbarChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  /****************************************/
  public years = [];
  public backups = [];


  constructor(private route: ActivatedRoute,
              private router: Router, private userService: UserService, private util: Utilerias) {
    this.resetbarchar();
    this.msj = "Creando Grafica de Gastos vs Ingresos, ¡ Porfavor espere !";
    this.userService.obtValoresGraficaGVSI(this.userService.User.id_user).subscribe(result => {
      this.resultado(result);
      /*this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
      this.backups = result.backups;
      this.backup = result.ultimoBackup;

      this.years = result.años;
      this.year = result.ultimoAño;

      console.log("this.years", this.years);
      console.log("this.year", this.year);
      console.log("this.backups", this.backups);
      console.log("this.backup", this.backup);
      if (!result.error) {

        this.barChartData[0].data = result.Gastos;
        this.barChartData[1].data = result.Ingresos;

        this.TotalbarChartLabels = result.TotalAñoLabel;
        this.TotalbarChartData[0].data = result.TotalGastos;
        this.TotalbarChartData[1].data = result.TotalIngresos;
      }*/
    }, error => {
      this.util.detenerLoading();
      this.util.msjErrorInterno(error);
    });
  }


  ngOnInit() {
  }
  public prueba(){
    this.resetbarchar();
    console.log("this.backup", this.backup);
    console.log("this.year", this.year);
    this.msj = "Generando Grafica de Gastos vs Ingresos, ¡ Porfavor espere !";
    this.util.crearLoading().then(() => {
      this.userService.obtValoresGraficaGVSI(this.userService.User.id_user, this.backup, this.year).subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.detenerLoading();
        this.util.msjErrorInterno(error);
      });
    });
  }

  private resultado(result){
    this.util.detenerLoading();
    this.util.msjToast(result.msj, result.titulo, result.error);
    this.backups = result.backups;
    this.backup = result.ultimoBackup;

    this.years = result.años;
    this.year = result.ultimoAño;

    console.log("this.years", this.years);
    console.log("this.year", this.year);
    console.log("this.backups", this.backups);
    console.log("this.backup", this.backup);
    if (!result.error) {

      this.barChartData[0].data = result.Gastos;
      this.barChartData[1].data = result.Ingresos;

      this.TotalbarChartLabels = result.TotalAñoLabel;
      this.TotalbarChartData[0].data = result.TotalGastos;
      this.TotalbarChartData[1].data = result.TotalIngresos;
    }
  }
  private resetbarchar(){
    this.barChartData[0].data = [];
    this.barChartData[1].data = [];

    this.TotalbarChartLabels = [];
    this.TotalbarChartData[0].data = [];
    this.TotalbarChartData[1].data = [];
  }

}
