import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'query-complete',
  templateUrl: './query-complete.component.html',
  styleUrls: ['./query-complete.component.css']
})
export class QueryCompleteComponent implements OnInit {

  @Input() msj;
  constructor() { }

  ngOnInit() {
  }

}
