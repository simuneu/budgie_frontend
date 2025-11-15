export interface Transaction {
  transactionId: number;
  amount: number;
  memo?: string;
  date: string;
  categoryId: number;
  categoryName?: string;
}
