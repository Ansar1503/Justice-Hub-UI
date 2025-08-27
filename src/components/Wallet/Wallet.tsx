"use client";

import { useState } from "react";
import { WalletCard } from "./WalletCard";
import { TransactionTable } from "./WalletTransactions";
import { AddFundsDialog } from "./AddFundsDialog";
import { useFetchWalletByUser } from "@/store/tanstack/Queries/walletQueries";

export interface Transaction {
  id: string;
  date: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
}

interface WalletProps {
  transactions?: Transaction[];
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-15T10:30:00Z",
    type: "debit",
    amount: 500,
    description: "Booking Session with Lawyer John Doe",
  },
  {
    id: "2",
    date: "2024-01-14T15:45:00Z",
    type: "credit",
    amount: 1000,
    description: "Wallet Top-up via UPI",
  },
  {
    id: "3",
    date: "2024-01-13T09:20:00Z",
    type: "debit",
    amount: 750,
    description: "Consultation with Advocate Smith",
  },
];

export function Wallet({ transactions = mockTransactions }: WalletProps) {
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const { data: WalletData } = useFetchWalletByUser();
  const handleAddFunds = (amount: number) => {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">My Wallet</h1>
        <p className="text-muted-foreground">
          Manage your funds and view transaction history
        </p>
      </div>

      <WalletCard
        balance={WalletData?.balance ?? 0}
        onAddFunds={() => setIsAddFundsOpen(true)}
      />

      <TransactionTable transactions={transactions} />

      <AddFundsDialog
        open={isAddFundsOpen}
        onOpenChange={setIsAddFundsOpen}
        onAddFunds={handleAddFunds}
      />
    </div>
  );
}
