export class Budgets {
  id_backup: number;
  id_account: number;
  id_category: number;
  period: number;
  amount: number;
  budget: number;
  initial_date: string;
  final_date: string;
  number: number;
  constructor(
    id_backup = 0,
    id_account = 0,
    id_category = 0,
    period = 0,
    amount = 0.000000,
    budget = 0.000000,
    initial_date = "0000-00-00",
    final_date = "0000-00-00",
    number = 0,
  ) {
    this.id_backup = id_backup;
    this.id_account = id_account;
    this.id_category = id_category;
    this.period = period;
    this.amount = amount;
    this.budget = budget;
    this.initial_date = initial_date;
    this.final_date = final_date;
    this.number = number;
  }
}
