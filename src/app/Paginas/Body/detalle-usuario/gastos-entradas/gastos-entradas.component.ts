import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../Servicios/user/user.service';
import {Utilerias} from '../../../../Utilerias/Util';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import html2canvas from 'html2canvas';

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
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Gastos'},
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Ingresos'}
  ];
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public TotalbarChartLabels = [''];
  public TotalbarChartType: ChartType = 'bar';
  public TotalbarChartLegend = true;

  public TotalbarChartData: ChartDataSets[] = [
    {data: [0], label: 'Gastos'},
    {data: [0], label: 'Ingresos'}
  ];
  public TotalbarChartOptions: ChartOptions  = {
    responsive: true,
    scales: {
      xAxes: [{
      }],
      yAxes: [{
        time: {
          ticks: {
            stepSize: 4000,
          }
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  /****************************************/
  public years = [];
  public backups = [];


  constructor(public route: ActivatedRoute,
              public router: Router, public userService: UserService, public util: Utilerias) {
    this.resetbarchar();
    this.msj = "Creando Grafica de Gastos vs Ingresos, ¡ Porfavor espere !";
    this.userService.obtValoresGraficaGVSI(this.userService.User.id_user).subscribe(result => {
      this.resultado(result);

    }, error => {
      this.util.detenerLoading();
      this.util.msjErrorInterno(error);
    });
  }


  ngOnInit() {
  }
  public prueba(){
    this.resetbarchar();
    console.log("this.id_backup", this.backup);
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

  public resultado(result){
    this.util.detenerLoading();
    this.util.msjToast(result.msj, result.titulo, result.error);
    this.backups = result.backups;
    this.backup = result.ultimoBackup;

    this.years = result.años;
    this.year = result.ultimoAño;

    console.log("this.years", this.years);
    console.log("this.year", this.year);
    console.log("this.backups", this.backups);
    console.log("this.id_backup", this.backup);
    if (!result.error) {

      this.barChartData[0].data = result.Gastos;
      this.barChartData[1].data = result.Ingresos;

      this.TotalbarChartLabels = result.TotalAnhoLabel;
      //this.TotalbarChartLabels = this.barChartLabels;
      this.TotalbarChartData[0].data = result.TotalGastos;
      this.TotalbarChartData[1].data = result.TotalIngresos;
      /*this.TotalbarChartData[0].data = this.barChartData[0].data;
      this.TotalbarChartData[1].data = this.barChartData[1].data;*/
    }
  }
  public resetbarchar(){
    this.barChartData[0].data = [];
    this.barChartData[1].data = [];

    this.TotalbarChartLabels = [];
    this.TotalbarChartData[0].data = [];
    this.TotalbarChartData[1].data = [];
  }
  public diferencia(): number {
    return (this.util.numberFormat(this.TotalbarChartData[1].data[0]) - this.util.numberFormat(this.TotalbarChartData[0].data[0]));
  }

  public exportPDF()
  {
    var data = document.getElementById('dataUserExport');
    var logoEMX = document.getElementById('logoEncodeMX');
    html2canvas(logoEMX, { scale: 3}).then(canvaslogoEMX => {
      html2canvas(data, { scale: 3}).then(canvas => {
        var img = canvas.toDataURL("image/png");
        var imgLogo = canvaslogoEMX.toDataURL("image/png");
        var imgWidth = 216;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        const documentDefinition = {
          defaultStyle: {
            fontSize: 20,
            bold: true,
          },
          info: {
            title: 'Reporte Gastos vs Ingresos usuario ' + this.userService.User.email,
            author: 'EncodeMX',
            subject: 'Reporte Gastos vs Ingresos',
            keywords: 'Gastos diarios.',
          },
          pageSize: 'letter',

          pageOrientation: 'landscape ',
          styles: {
            imgLogo: {
              borderBottom: ['#000000'],
            },
            header: {
              fontSize: 15,
              alignment: 'center',
              bold: false,
              bodyFontFamily: 'Century Gothic',
              marginBottom: 5
            },
            anotherStyle: {
              fontSize: 12,
              bold: false,
              fontWeight: 'lighter',
              bodyFontFamily: 'Century Gothic',
              alignment: 'center',
              marginBottom: 50
            }
          },
          pageMargins: [ 5, 15, 5, 5],

          content: [
            {
              image: imgLogo,
              height:  10 * 11,
              width: 50 * 11,
              alignment: 'center',
            },
            {
              text: 'Reporte Gastos vs Ingresos', style: 'header'
            },
            {
              text: 'usuario: ' + this.userService.User.email, style: 'anotherStyle'
            },
            {
              image: img,
              width: imgWidth * 2.78,
              height: imgHeight * 2.78}]
        };
        pdfMake.createPdf(documentDefinition).open();

      });
    });

  }
}
