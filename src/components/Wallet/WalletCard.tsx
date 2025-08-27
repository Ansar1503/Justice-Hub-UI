"use client";

import { WalletIcon, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WalletCardProps {
  balance: number;
  onAddFunds: () => void;
}

export function WalletCard({ balance, onAddFunds }: WalletCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="relative overflow-hidden rounded-2xl shadow-md ">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
      <CardHeader className="relative pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <WalletIcon className="h-5 w-5 text-primary" />
          Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="space-y-1">
          <p className="text-3xl font-bold text-foreground">
            {formatCurrency(balance)}
          </p>
          <p className="text-sm text-muted-foreground">Available balance</p>
        </div>
        <Button onClick={onAddFunds} className="w-full sm:w-auto" size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Funds
        </Button>
      </CardContent>
    </Card>
  );
}
