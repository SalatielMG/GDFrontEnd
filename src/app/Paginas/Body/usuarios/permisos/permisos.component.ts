import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../../Utilerias/Util';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.css']
})
export class PermisosComponent implements OnInit {

  constructor(private util: Utilerias) { }

  ngOnInit() {
  }

}
