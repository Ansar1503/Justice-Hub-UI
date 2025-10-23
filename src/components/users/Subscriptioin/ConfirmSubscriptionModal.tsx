import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { SubscriptionType } from "@/types/types/SubscriptionType"

interface ConfirmSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  selectedPlan: SubscriptionType | null
}

export default function ConfirmSubscriptionModal({
  isOpen,
  onClose,
  onConfirm,
  selectedPlan,
}: ConfirmSubscriptionModalProps) {
  const priceDisplay = selectedPlan ? (selectedPlan.isFree ? "₹0" : `₹${selectedPlan.price}`) : "₹0"

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Subscription</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-4">
              <p>
                You are about to subscribe to the{" "}
                <span className="font-semibold text-foreground">{selectedPlan?.name}</span> plan.
              </p>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  {selectedPlan?.interval === "yearly" ? "Annual" : "Monthly"} charge
                </p>
                <p className="text-2xl font-bold text-foreground">{priceDisplay}</p>
              </div>
              <p className="text-sm">
                Your subscription will renew automatically every {selectedPlan?.interval}. You can cancel anytime from
                your account settings.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-teal-500 hover:bg-teal-600 text-white">
            Confirm Subscription
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
