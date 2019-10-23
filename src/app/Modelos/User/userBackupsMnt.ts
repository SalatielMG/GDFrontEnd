import {Backup} from "../Backup/backup";
import {FiltrosSearchBackups} from '../Backup/filtros-search-backups';

export class UserBackupsMnt {
  id_user: number;
  email: string;

  // collapsed: number;
  collapsed: boolean;
  cantRep: number;
  checked: boolean;
  msj: string;


  // --------------------------------------- Variables - Multifiltros
  backups: Backup[] = [];
  backupsFiltro: Backup[] = [];
  filtrosSearch = new FiltrosSearchBackups();
  indexBackupSelected: number = 0;
  indexBackupFilterSelected: number = 0;
  id_BackupSelected: number =0;
  // --------------------------------------- Variables - Multifiltros
  constructor(id_user = 0, email = "", collapsed = false, backups: Backup[] = [], cantRep = 0, checked = false, filtrosSearch = new FiltrosSearchBackups(), backupsFiltro: Backup[] = [], msj = "", indexBackupSelected = 0, indexBackupFilterSelected = 0, id_BackupSelected = 0) {
    this.id_user = id_user;
    this.email = email;
    this.collapsed = collapsed;
    this.backups = backups;
    this.cantRep = cantRep;
    this.checked = checked;
    this.msj = msj;
    this.filtrosSearch = filtrosSearch;
    this.backupsFiltro = backupsFiltro;
    this.indexBackupSelected = indexBackupSelected;
    this.indexBackupFilterSelected = indexBackupFilterSelected;
    this.id_BackupSelected = id_BackupSelected;
  }
}
