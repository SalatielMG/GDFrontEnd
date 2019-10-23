export class Backup {
  id_backup: number;
  id_user: number;
  automatic: number;
  date_creation: string;
  date_download: string;
  created_in: string;

  checked: boolean;

  constructor(
    id_backup = 0,
    id_user = 0,
    automatic = 0,
    date_creation = "",
    date_download = "",
    created_in = "",
    checked = false) {
    this.id_backup = id_backup;
    this.id_user = id_user;
    this.automatic = automatic;
    this.date_creation = date_creation;
    this.date_download = date_download;
    this.created_in = created_in;
    this.checked = checked;
  }
}
