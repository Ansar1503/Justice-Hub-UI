"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import LawyerVerificationForm from "../forms/Verification";
import { useLawyerVerification } from "@/hooks/tanstack/mutations";

interface LawyerVerificationFormProps {
  setVerificationModalOpen: (open: boolean) => void;
}

function LawyerVerificationFormModal({ setVerificationModalOpen }: LawyerVerificationFormProps) {
  const { isPending } = useLawyerVerification();
  
  return (
    <Dialog open={true} onOpenChange={() => {
      if (!isPending) {
        setVerificationModalOpen(false);
      }
    }}>
      <DialogContent
        className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative"
      >
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 rounded-lg">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center gap-3">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Submitting verification...
              </p>
            </div>
          </div>
        )}
        
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Lawyer Verification
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <LawyerVerificationForm 
            setVerificationModalOpen={setVerificationModalOpen} 
            isOpen={true} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LawyerVerificationFormModal;