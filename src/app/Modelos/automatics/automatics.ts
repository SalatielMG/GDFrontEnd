export class Automatics {
  id_backup: number;
  id_operation: number;
  id_account: number;
  id_category: number;
  period: number;
  repeat_number: number;
  each_number: number;
  enabled: number;
  amount: number;
  sign: string;
  detail: string;
  initial_date: string;
  next_date: string;
  operation_code: string;
  rate: number;
  counter: number;
  constructor(
    id_backup = 0,
    id_operation = 0,
    id_account = 0,
    id_category = 0,
    period = 0,
    repeat_number = 0,
    each_number = 0,
    enabled = 0,
    amount = 0.000000,
    sign = "-",
    detail = "",
    initial_date = "0000-00-00",
    next_date = "0000-00-00",
    operation_code = "",
    rate = 0.000000,
    counter = 0
  ) {
    this.id_backup = id_backup;
    this.id_operation = id_operation;
    this.id_account = id_account;
    this.id_category = id_category;
    this.period = period;
    this.repeat_number = repeat_number;
    this.each_number = each_number;
    this.enabled = enabled;
    this.amount = amount;
    this.sign = sign;
    this.detail = detail;
    this.initial_date = initial_date;
    this.next_date = next_date;
    this.operation_code = operation_code;
    this.rate =rate;
    this.counter = counter;
  }
}
