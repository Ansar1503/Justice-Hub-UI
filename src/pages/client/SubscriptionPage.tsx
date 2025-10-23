import { useState } from "react";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import SubscriptionHeader from "@/components/users/Subscriptioin/SubscriptionHeader";
import PlanGrid from "@/components/users/Subscriptioin/PlanGrid";
import { PlanComparison } from "@/components/users/Subscriptioin/PlanComparison";
import ConfirmSubscriptionModal from "@/components/users/Subscriptioin/ConfirmSubscriptionModal";
import CancelSubscriptionModal from "@/components/users/Subscriptioin/CancelSubscriptionModal";
import {
  useFetchAllSubscriptionPlans,
  useFetchCurrentUserSubscription,
  useSubscibePlan,
} from "@/store/tanstack/mutations/SubscriptionMutation";
import type { SubscriptionType } from "@/types/types/SubscriptionType";

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionType | null>(
    null
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { data: plans = [] } = useFetchAllSubscriptionPlans();
  const { data: userSubscription } = useFetchCurrentUserSubscription();

  const { mutateAsync: Subscibe } = useSubscibePlan();

  const currentPlanId = userSubscription?.planId;
  const currentPlan = plans.find((p) => p.id === currentPlanId);
  const renewalDate = userSubscription?.endDate
    ? new Date(userSubscription.endDate).toISOString()
    : new Date().toISOString();

  const handleSubscribe = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (plan?.isFree) {
      console.warn("Cannot subscribe to free plan");
      return;
    }
    setSelectedPlan(plan || null);
    setShowConfirmModal(true);
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmSubscription = async () => {
    try {
      if (!selectedPlan?.id) return;
      const SubscribeData = await Subscibe({ planId: selectedPlan.id });
      if (SubscribeData?.checkoutUrl) {
        window.location.href = SubscribeData.checkoutUrl;
      } else {
        console.log("no checkout url");
      }
    } catch (error) {
      console.log("error", error);
    }
    setShowConfirmModal(false);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen  bg-[#FFF2F2] dark:bg-black">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="w-full">
          <div className="mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <SubscriptionHeader
              currentPlan={currentPlan || null}
              userSubscription={userSubscription || null}
              renewalDate={renewalDate}
              onCancel={handleCancel}
            />
            <PlanGrid
              currentPlan={currentPlanId || ""}
              plans={plans}
              onSubscribe={handleSubscribe}
            />
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Plan Comparison</h2>
              <PlanComparison plans={plans} />
            </div>
          </div>

          <ConfirmSubscriptionModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleConfirmSubscription}
            selectedPlan={selectedPlan}
          />

          <CancelSubscriptionModal
            isOpen={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            onConfirm={handleConfirmCancel}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
