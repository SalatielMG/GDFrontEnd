import {Backup} from "../Backup/backup";
import {FiltrosSearchBackupsUser} from "../Backup/filtros-search-backups-user";

export class UserBackupsMnt {
  id_user: number;
  email: string;

  // collapsed: number;
  collapsed: boolean;
  backups: Backup[];
  cantRep: number;
  checked: boolean;
  msj: string;


  // --------------------------------------- Variables - Multifiltros
  filtrosSearch = new FiltrosSearchBackupsUser();
  backupsFiltro: Backup[];
  // --------------------------------------- Variables - Multifiltros
  constructor(id_user = 0, email = "", collapsed = false, backups = [], cantRep = 0, checked = false, filtrosSearch = new FiltrosSearchBackupsUser(), backupsFiltro = [], msj = "") {
    this.id_user = id_user;
    this.email = email;
    this.collapsed = collapsed;
    this.backups = backups;
    this.cantRep = cantRep;
    this.checked = checked;
    this.msj = msj;
    this.filtrosSearch = filtrosSearch;
    this.backupsFiltro = backupsFiltro;
  }
}
