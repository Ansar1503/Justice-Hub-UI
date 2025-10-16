import { MapPin, Briefcase, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Lawyer {
  id: string;
  name: string;
  profileImage?: string;
  specialization: string[];
  practiceAreas: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  location: string;
  consultationFee: number;
  verified?: boolean;
}

interface LawyersCardProps {
  lawyer: Lawyer;
  getVerificationBadge: (verified: boolean) => React.ReactNode;
}

export default function LawyersCard({
  lawyer,
  getVerificationBadge,
}: LawyersCardProps) {
  const initials = lawyer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="group h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/10 transition-all group-hover:ring-primary/30">
            <AvatarImage src={lawyer.profileImage} alt={lawyer.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg truncate">{lawyer.name}</h3>
              {lawyer.verified && getVerificationBadge(true)}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{lawyer.location}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pb-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Practice Areas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {lawyer.specialization.slice(0, 3).map((spec, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
            {lawyer.specialization.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{lawyer.specialization.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4 text-primary" />
            <span className="font-medium">{lawyer.experience} years</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
            <DollarSign className="h-4 w-4 text-primary" />
            <span>₹{lawyer.consultationFee.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-border/50">
        <Button
          className="w-full group-hover:shadow-md transition-all"
          variant="default"
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
