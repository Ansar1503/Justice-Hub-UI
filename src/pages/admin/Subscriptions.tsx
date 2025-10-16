import { PlanTable } from "@/components/admin/Subscription/PlanTable";
import { AdminLayout } from "./layout/admin.layout";
import { SubscriptionType } from "@/types/types/SubscriptionType";

export default function Subscriptions() {
  return (
    <AdminLayout>
      <section className="grid gap-4">
        <PlanTable
          plans={[]}
          onEdit={(plan: SubscriptionType) => {
            console.log("planto edit", plan);
          }}
          onDeactivate={(id: string) => {
            console.log("id", id);
          }}
        />
      </section>
    </AdminLayout>
  );
}
