import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CancelSubscriptionModal({
  isOpen,
  onClose,
  onConfirm,
}: CancelSubscriptionModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-4">
              <p>
                Are you sure you want to cancel your subscription? You will lose
                access to premium features immediately.
              </p>
              <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20">
                <p className="text-sm font-medium text-destructive">
                  This action cannot be undone. Your data will be retained for
                  30 days.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                If you have any feedback about your experience, we'd love to
                hear it.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90"
          >
            Cancel Subscription
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
