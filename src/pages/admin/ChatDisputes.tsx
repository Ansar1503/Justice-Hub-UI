import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminLayout } from "./layout/admin.layout";
import ChatDisputeCardContent from "@/components/admin/ChatDisputeCardContent";

export default function ChatDisputes() {
  return (
    <AdminLayout>
      <Card className="bg-textLight dark:bg-stone-800 mt-5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Chats Disputes Managment</CardTitle>
            <CardDescription>
              Manage clients-Lawyer Chats Disputes
            </CardDescription>
          </div>
        </CardHeader>
        <ChatDisputeCardContent />
      </Card>
    </AdminLayout>
  );
}
