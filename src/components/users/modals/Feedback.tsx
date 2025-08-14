"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Plus } from "lucide-react";
import ReviewForm from "@/components/users/forms/ReviewForm";
import Reviews from "@/components/users/Reviews";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyerId: string;
  sessionId: string;
  lawyerName: string;
}

export default function FeedbackModal({
  sessionId,
  isOpen,
  onClose,
  lawyerId,
  lawyerName,
}: FeedbackModalProps) {
  const [activeTab, setActiveTab] = useState("reviews");

  const handleReviewSubmitted = () => {
    setActiveTab("reviews");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Feedback for {lawyerName}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="add-review" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Review
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="reviews"
            className="mt-4 overflow-y-auto max-h-[60vh]"
          >
            <Reviews user_id={lawyerId} sessoin_id={""} />
          </TabsContent>

          <TabsContent
            value="add-review"
            className="mt-4 overflow-y-auto max-h-[60vh]"
          >
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <ReviewForm
                lawyer_id={lawyerId}
                sessionId={sessionId}
                onReviewSubmitted={handleReviewSubmitted}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
