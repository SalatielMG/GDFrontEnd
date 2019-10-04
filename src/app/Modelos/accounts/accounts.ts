export class Accounts {
  id_backup: number;
  id_account: number;
  name: string;
  detail: string;
  sign: string;
  income: number;
  expense: number;
  initial_balance: number;
  final_balance: number;
  month: number;
  year: number;
  positive_limit: number;
  negative_limit: number;
  positive_max: number;
  negative_max: number;
  iso_code: string;
  selected: number;
  value_type: number;
  include_total: number;
  rate: number;
  icon_name: string;
  constructor (
    id_backup = 0,
    id_account = 0,
    name = '',
    detail = '',
    sign = '-',
    income = 0.000000,
    expense = 0.000000,
    initial_balance = 0.000000,
    final_balance = 0.000000,
    month = 0,
    year = 0,
    positive_limit = 1,
    negative_limit = 0,
    positive_max = 0.000000,
    negative_max = 0.000000,
    iso_code = '',
    selected = 0,
    value_type = 1,
    include_total = 1,
    rate = 1.000000,
    icon_name = ''
  )
  {
    this.id_backup = id_backup;
    this.id_account = id_account;
    this.name = name;
    this.detail = detail;
    this.sign = sign;
    this.income = income;
    this.expense = expense;
    this.initial_balance = initial_balance;
    this.final_balance = final_balance;
    this.month = month;
    this.year = year;
    this.positive_limit = positive_limit;
    this.negative_limit = negative_limit;
    this.positive_max = positive_max;
    this.negative_max = negative_max;
    this.iso_code = iso_code;
    this.selected = selected;
    this.value_type = value_type;
    this.include_total = include_total;
    this.rate = rate;
    this.icon_name = icon_name;
  }
}
