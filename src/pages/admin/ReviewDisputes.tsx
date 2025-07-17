import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "./layout/admin.layout"
import ReviewDisputeCardContent from "@/components/admin/ReviewDisputesContent"

export default function ReviewDisputes() {
  return (
    <AdminLayout>
      <Card className="bg-textLight dark:bg-stone-800 mt-5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Review Disputes Management</CardTitle>
              <CardDescription>Manage Client-Lawyer Review Disputes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <ReviewDisputeCardContent />
      </Card>
    </AdminLayout>
  )
}
