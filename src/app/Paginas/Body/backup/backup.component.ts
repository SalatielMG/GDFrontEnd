import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Servicios/user/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.css']
})
export class BackupComponent implements OnInit {
  private numBack;
  private idBack;
  constructor(private userService: UserService, private route: ActivatedRoute,
              private router: Router) {
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
