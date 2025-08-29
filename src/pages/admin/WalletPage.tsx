import { Wallet } from "@/components/Wallet/Wallet";
import { AdminLayout } from "./layout/admin.layout";

export default function WalletPage() {
  return (
    <AdminLayout>
      <div className="px-32 py-10">
        <Wallet />
      </div>
    </AdminLayout>
  );
}
