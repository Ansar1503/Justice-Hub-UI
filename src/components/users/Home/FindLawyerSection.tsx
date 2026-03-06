import { useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function FindLawyerSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-muted/50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Search className="h-4 w-4" />
              Browse Our Network
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              Find Your <span className="text-primary">Perfect Lawyer</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Browse through our verified network of 500+ experienced lawyers across all practice areas.
              Filter by specialization, location, and ratings to find the right match for your case.
            </p>
          </div>

          {/* Right CTA */}
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={() => navigate("/lawyers")}
              size="lg"
              className="text-lg px-10 py-6 font-semibold group"
            >
              Find a Lawyer Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-muted-foreground">
              No signup required to browse
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FindLawyerSection;
