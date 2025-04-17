import { Button } from "@/components/ui/button";

export function ButtonLink({ text }: { text: string }) {
  return (
    <Button variant="link" className="text-blue-600">
      {text}
    </Button>
  );
}
