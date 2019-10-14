export class Categories {
  id_backup: number;
  id_category: number;
  id_account: number;
  name: string;
  sign: string;
  icon_name: string;
  number: number;

  constructor(
    id_backup = 0,
    id_category = 0,
    id_account = 0,
    name = "",
    sign = "-",
    icon_name = "",
    number = 0,
  ) {
    this.id_backup = id_backup;
    this.id_category = id_category;
    this.id_account = id_account;
    this.name = name;
    this.sign = sign;
    this.icon_name = icon_name;
    this.number = number;
  }
}
