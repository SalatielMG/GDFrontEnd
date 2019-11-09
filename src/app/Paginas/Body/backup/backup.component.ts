import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Servicios/user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import {Utilerias} from "../../../Utilerias/Util";

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.css']
})
export class BackupComponent implements OnInit {
  public numBack;
  public idBack;
  constructor(public userService: UserService, public route: ActivatedRoute,
              public router: Router, public util: Utilerias) {
    this.route.paramMap.subscribe(params => {
      this.numBack = params.get('numBack');
      this.idBack = params.get('idBack');
    });
    this.router.navigate(["accounts"], {relativeTo: this.route});
    // Consultar todos las tablas relacionadas co Backups.
  }

  ngOnInit() {
  }

  public prueba(tipo) {
    console.log("Event", tipo);
  }
}
