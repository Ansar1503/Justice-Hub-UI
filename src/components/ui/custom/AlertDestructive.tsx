import { TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
export function AlertDestructive({
  message,
  title,
}: {
  message: string;
  title: string;
}) {
  return (
    <Alert variant="destructive" className="p-3 border-0  text-yellow-600">
      <TriangleAlert className="w-4 " color="#FFB81C" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
