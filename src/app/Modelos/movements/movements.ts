export class Movements {
  id_backup: number;
  id_account: number;
  id_category: number;
  amount: number;
  sign: string;
  detail: string;
  date_record: string;
  time_record: string;
  confirmed: number;
  transfer: number;
  date_idx: string;
  day: number;
  week: number;
  fortnight: number;
  month: number;
  year: number;
  operation_code: string;
  picture: string;
  iso_code: string;

  constructor(
    id_backup = 0,
    id_account = 0,
    id_category = 0,
    amount = 0.000000,
    sign = "-",
    detail = "",
    date_record = "0000-00-00",
    time_record = "00:00:00",
    confirmed = 1,
    transfer = 0,
    date_idx = "",
    day = 0,
    week = 0,
    fortnight = 0,
    month = 0,
    year = 0,
    operation_code = "",
    picture = "",
    iso_code = "",
  ) {
    this.id_backup = id_backup;
    this.id_account = id_account;
    this.id_category = id_category;
    this.amount = amount;
    this.sign = sign;
    this.detail = detail;
    this.date_record = date_record;
    this.time_record = time_record;
    this.confirmed = confirmed;
    this.transfer = transfer;
    this.date_idx = date_idx;
    this.day = day;
    this.week = week;
    this.fortnight = fortnight;
    this.month = month;
    this.year = year;
    this.operation_code = operation_code;
    this.picture = picture;
    this.iso_code = iso_code;
  }
}
