import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { LawerDataType } from "@/types/types/Client.data.type";
import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";

export function RejectLawyerModal(payload: {
  statusChangePending: boolean;
  isRejectionDialogOpen: boolean;
  setIsRejectionDialogOpen: (val: boolean) => void;
  lawyer: LawerDataType;
  rejectionReason: string;
  setRejectionReason: (val: string) => void;
  handleRejectionSubmit: (val: string) => void;
}) {
  return (
    <Dialog
      open={payload.isRejectionDialogOpen}
      onOpenChange={payload.setIsRejectionDialogOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Verification</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting {payload.lawyer.name}'s
            verification.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="rejection-reason">Rejection Reason</Label>
          <Textarea
            id="rejection-reason"
            value={payload.rejectionReason}
            onChange={(e) => payload.setRejectionReason(e.target.value)}
            placeholder="Enter the reason for rejection..."
            className="mt-2"
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => payload.setIsRejectionDialogOpen(false)}
            disabled={payload.statusChangePending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={
              payload.statusChangePending || !payload.rejectionReason.trim()
            }
            onClick={() =>
              payload.handleRejectionSubmit(payload.lawyer.user_id)
            }
          >
            {payload.statusChangePending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Confirm Rejection"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
