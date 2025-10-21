import { useState } from "react";
import { PlanTable } from "@/components/admin/Subscription/PlanTable";
import type { SubscriptionType } from "@/types/types/SubscriptionType";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PlanDetailsDrawer } from "@/components/admin/Subscription/PlanDetailsDrawer";
import { PlanForm } from "@/components/admin/Subscription/PlanForm";
import {
  useAddSubscriptionMutation,
  useChangeActiveSubscriptionStatus,
  useFetchAllSubscriptionPlans,
  useUpdateSubscriptionPlan,
} from "@/store/tanstack/mutations/SubscriptionMutation";
import { AdminLayout } from "./layout/admin.layout";

export default function Subscriptions() {
  const [formOpen, setFormOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionType | null>(
    null
  );
  const { mutateAsync: addSubscription, isPending: SubscriptionAdding } =
    useAddSubscriptionMutation();
  const {
    mutateAsync: updateSubscriptionPlan,
    isPending: updatingSubscription,
  } = useUpdateSubscriptionPlan();
  const { mutateAsync: ChangeActiveStatus, isPending: ChangingStatus } =
    useChangeActiveSubscriptionStatus();
  const { data: plans = [], refetch } = useFetchAllSubscriptionPlans();

  const handleAddPlan = () => {
    setSelectedPlan(null);
    setFormOpen(true);
  };

  const handleEdit = (plan: SubscriptionType) => {
    setSelectedPlan(plan);
    setFormOpen(true);
  };

  const handleViewDetails = (plan: SubscriptionType) => {
    setSelectedPlan(plan);
    setDrawerOpen(true);
  };

  const handleDeactivate = async (id: string) => {
    try {
      await ChangeActiveStatus({ id, status: false });
    } catch (error) {
      console.log("error status update", error);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await ChangeActiveStatus({ id, status: true });
    } catch (error) {
      console.log("error status update", error);
    }
  };

  const handleAddPlanFormSubmit = async (
    plan: Omit<SubscriptionType, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await addSubscription(plan);
      setFormOpen(false);
      refetch();
    } catch (error) {
      console.log("errors", error);
    }
  };

  const handleEditPlanFormSubmit = async (
    plan: Omit<SubscriptionType, "createdAt" | "updatedAt">
  ) => {
    if (!plan) return;
    try {
      await updateSubscriptionPlan(plan);
    } catch (error) {
      console.log("errors updating", error);
    }
  };
  return (
    <AdminLayout>
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Subscription Plans
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage and configure user subscription plans, pricing, and
              benefits.
            </p>
          </div>

          <Button
            disabled={
              SubscriptionAdding || updatingSubscription || ChangingStatus
            }
            onClick={handleAddPlan}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {SubscriptionAdding
              ? "Adding..."
              : updatingSubscription
              ? "updating..."
              : "Add New Plan"}
          </Button>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-300 dark:border-gray-700 mb-4" />

        {/* Table Section */}
        <section className="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-200 dark:border-stone-700 p-4">
          <PlanTable
            plans={plans}
            onEdit={handleEdit}
            onDeactivate={handleDeactivate}
            onViewDetails={handleViewDetails}
            onActivate={handleActivate}
          />
        </section>

        <PlanForm
          open={formOpen}
          onOpenChange={setFormOpen}
          initialPlan={selectedPlan}
          onAdd={handleAddPlanFormSubmit}
          onEdit={handleEditPlanFormSubmit}
        />

        <PlanDetailsDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          plan={selectedPlan}
        />
      </div>
    </AdminLayout>
  );
}
