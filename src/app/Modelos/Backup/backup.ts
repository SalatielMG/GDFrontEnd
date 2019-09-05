export interface Backup {
  id_backup: number,
  id_user: number,
  automatic: number,
  date_creation: string,
  date_download: string,
  created_in: string,

  collapsed: number,
  backups: Backup[],
  msj: string,
  cantRep: number,
}
