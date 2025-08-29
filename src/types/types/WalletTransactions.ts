export type transactionCategory =
  | "deposit"
  | "withdrawal"
  | "payment"
  | "refund"
  | "transfer";
type transactionStatus = "pending" | "completed" | "failed" | "cancelled";
export type transactionType = "debit" | "credit";

export interface WalletTransactions {
  id: string;
  walletId: string;
  amount: number;
  type: transactionType;
  description: string;
  category: transactionCategory;
  status: transactionStatus;
  createdAt: Date;
  updatedAt: Date;
}
