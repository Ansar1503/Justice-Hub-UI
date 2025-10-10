import { UserManagement } from "@/components/admin/UserManagement";
import { AdminLayout } from "./layout/admin.layout";

export default function UserManagementPage() {
  return (
    <AdminLayout>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
        <UserManagement />
      </div>
    </AdminLayout>
  );
}
