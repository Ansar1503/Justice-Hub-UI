import { Badge } from "./ui/badge";

type Props = {
  status: string;
  className?: string;
};

export default function StatusBadge({ status, className }: Props) {
  return <Badge className={className}>{status} </Badge>;
}
