import { LawyersList } from "@/components/admin/LawyersList";
import { AdminLayout } from "./layout/admin.layout";

function LawyerVerification() {
  return (
    <AdminLayout>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <LawyersList />
      </div>
    </AdminLayout>
  );
}

export default LawyerVerification;
