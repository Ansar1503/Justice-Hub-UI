import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LawyerVerificationForm from "../Forms/Verification";
import { useState } from "react";
import { FourSquare } from "react-loading-indicators";

interface LawyerVerificationFormProps {
  setVerificationModalOpen: (open: boolean) => void;
}

function LawyerVerificationFormModal({
  setVerificationModalOpen,
}: LawyerVerificationFormProps) {
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={true} onOpenChange={() => setVerificationModalOpen(false)}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 shadow-lg p-6 ">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Lawyer Verification
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <FourSquare
                color="#2f302f"
                size="medium"
                text="sending request..."
                textColor="#000000"
              />
            </div>
          ) : (
            <LawyerVerificationForm
              setLoading={setLoading}
              setVerificationModalOpen={setVerificationModalOpen}
              isOpen={true}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LawyerVerificationFormModal;
