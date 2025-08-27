"use client";

import { useState } from "react";
import { WalletCard } from "./WalletCard";
import { TransactionTable } from "./WalletTransactions";
import { AddFundsDialog } from "./AddFundsDialog";

export interface Transaction {
  id: string;
  date: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
}

interface WalletProps {
  balance?: number;
  transactions?: Transaction[];
}

// Mock transaction data
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
  {
    id: "4",
    date: "2024-01-12T14:15:00Z",
    type: "credit",
    amount: 2000,
    description: "Refund for Cancelled Session",
  },
  {
    id: "5",
    date: "2024-01-11T11:30:00Z",
    type: "debit",
    amount: 300,
    description: "Document Review Service",
  },
  {
    id: "6",
    date: "2024-01-10T16:45:00Z",
    type: "credit",
    amount: 1500,
    description: "Wallet Top-up via Card",
  },
  {
    id: "7",
    date: "2024-01-09T13:20:00Z",
    type: "debit",
    amount: 450,
    description: "Legal Advice Session",
  },
  {
    id: "8",
    date: "2024-01-08T10:10:00Z",
    type: "credit",
    amount: 800,
    description: "Cashback Reward",
  },
  {
    id: "9",
    date: "2024-01-07T17:30:00Z",
    type: "debit",
    amount: 600,
    description: "Contract Review with Lawyer XYZ",
  },
  {
    id: "10",
    date: "2024-01-06T12:45:00Z",
    type: "credit",
    amount: 1200,
    description: "Wallet Top-up via Netbanking",
  },
];

export function Wallet({
  balance = 2500,
  transactions = mockTransactions,
}: WalletProps) {
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(balance);

  const handleAddFunds = (amount: number) => {
    setCurrentBalance((prev) => prev + amount);
    setIsAddFundsOpen(false);
  };

  return (
    <div className="space-y-6">
      <WalletCard
        balance={currentBalance}
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
