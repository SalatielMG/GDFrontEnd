export class Preferences {
  id_backup: number;
  key_name: string;
  value: string;
  constructor(
    id_backup = 0,
    key_name = "",
    value = "",
  ) {
    this.id_backup = id_backup;
    this.key_name = key_name;
    this.value = value;
  }
}
