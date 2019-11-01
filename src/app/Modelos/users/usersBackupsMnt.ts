import {Backup} from "../Backup/backup";
import {FiltrosSearchBackups} from '../Backup/filtros-search-backups';
import {Users} from './users';

export class UsersBackupsMnt extends Users{

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
  constructor(collapsed = false, backups: Backup[] = [], cantRep = 0, checked = false, filtrosSearch = new FiltrosSearchBackups(), backupsFiltro: Backup[] = [], msj = "", indexBackupSelected = 0, indexBackupFilterSelected = 0, id_BackupSelected = 0) {
    super();
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
