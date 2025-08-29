// import { useState } from "react";
import { WalletCard } from "./WalletCard";
// import { AddFundsDialog } from "./AddFundsDialog";
import { useFetchWalletByUser } from "@/store/tanstack/Queries/walletQueries";
import { TransactionTable } from "./WalletTransactions";

export function Wallet() {
  // const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const { data: WalletData } = useFetchWalletByUser();
  // const handleAddFunds = (amount: number) => {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">My Wallet</h1>
        <p className="text-muted-foreground">
          Manage your funds and view transaction history
        </p>
      </div>

      <WalletCard balance={WalletData?.balance ?? 0} />

      <TransactionTable />

      {/* <AddFundsDialog
        open={isAddFundsOpen}
        onOpenChange={setIsAddFundsOpen}
        onAddFunds={handleAddFunds}
      /> */}
    </div>
  );
}
