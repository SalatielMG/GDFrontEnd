import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../Utilerias/Util';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor(private util: Utilerias) { }

  ngOnInit() {
  }

}
