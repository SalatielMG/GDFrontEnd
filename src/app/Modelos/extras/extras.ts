export class Extras {
  id_backup: number;
  id_extra: number;
  account: string;
  category: string;
  constructor(
    id_backup = 0,
    id_extra = 0,
    account = "",
    category = "",
  ){
    this.id_backup = id_backup;
    this.id_extra = id_extra;
    this.account = account;
    this.category = category;
  }
}
