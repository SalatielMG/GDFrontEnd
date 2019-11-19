import {Component, Input, OnInit} from '@angular/core';
import {Utilerias} from '../../Utilerias/Util';

@Component({
  selector: 'query-complete',
  templateUrl: './query-complete.component.html',
  styleUrls: ['./query-complete.component.css']
})
export class QueryCompleteComponent implements OnInit {

  @Input() msj;
  @Input() isFiltro: boolean = false;
  constructor(private util: Utilerias) { }

  ngOnInit() {
  }

}
