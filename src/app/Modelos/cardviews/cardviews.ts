export class Cardviews {
  id_backup: number;
  id_card: number;
  name: string;
  period: string;
  sign: string;
  show_card: number;
  number: number;
  constructor(
    id_backup = 0,
    id_card = -1,
    name = "",
    period = "",
    sign = "-",
    show_card = 1,
    number = 0,
  ) {
    this.id_backup = id_backup;
    this.id_card = id_card;
    this.name = name;
    this.period = period;
    this.sign = sign;
    this.show_card = show_card;
    this.number = number;
  }
}
