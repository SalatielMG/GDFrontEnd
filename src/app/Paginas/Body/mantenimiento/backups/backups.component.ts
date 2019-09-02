import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../../Utilerias/Util';

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.css']
})
export class BackupsComponent implements OnInit {

  private email: string = "";
  //public usuarioMntSearch: FormGroup;

  constructor(private util: Utilerias) { }

  ngOnInit() {
    //this.construirFormulario();
  }
  /*public construirFormulario() {
    this.usuarioMntSearch = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
    });
  }*/

  public search() {
    console.log("email user:", this.email);
    if (this.email.length == 0)
      this.util.emailUserMntBackup = "Generales";
    else {
      if ((this.util.regex_email).exec(this.email)) {
        this.util.emailUserMntBackup = this.email;
      } else {
        this.util.msjToast("Porfavor ingrese un correo valido", "Email no Valido", true);
      }
    }

  }

}
