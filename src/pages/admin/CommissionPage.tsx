import { Briefcase } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CommissionSettings from "@/components/admin/CommissionSettings";
import { AdminLayout } from "./layout/admin.layout";

export default function CommissionPage() {
  return (
    <AdminLayout>
      <main className="p-6 md:p-10">
        <header className="mb-6 flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Briefcase className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Commission Settings</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold leading-tight text-foreground text-balance">
              Commission Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure platform commissions for lawyer sessions.
            </p>
          </div>
        </header>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Admin Commission</CardTitle>
            <CardDescription className="text-muted-foreground">
              Set the percentages for initial and follow-up bookings. You can
              adjust anytime.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CommissionSettings />
          </CardContent>
        </Card>
      </main>
    </AdminLayout>
  );
}
