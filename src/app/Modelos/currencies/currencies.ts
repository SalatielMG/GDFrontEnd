export class Currencies {
  id_backup: number;
  iso_code: string;
  symbol: string;
  icon_name: string;
  selected: number;

  constructor(
    id_backup = 0,
    iso_code = "",
    symbol = "",
    icon_name = "",
    selected = 1,
  ){
    this.id_backup = id_backup;
    this.iso_code = iso_code;
    this.symbol = symbol;
    this.icon_name = icon_name;
    this.selected = selected;
  }
}
