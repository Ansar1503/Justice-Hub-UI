import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-brand-primary relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-brand-cream mb-6 animate-fade-in-up">
          Ready to Get Legal Help?
        </h2>
        <p className="text-lg md:text-xl text-brand-cream/80 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
          Don't navigate legal challenges alone. Connect with expert lawyers
          today and get the guidance you deserve.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-200">
          <Button
            onClick={() => navigate("/signup")}
            size="lg"
            className="bg-secondary text-secondary-foreground hover:bg-accent font-semibold text-lg px-8 group"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-transparent border-2 border-brand-cream text-brand-cream hover:bg-brand-cream hover:text-brand-primary font-semibold text-lg px-8 group"
          >
            <Phone className="mr-2 h-5 w-5" />
            Call: 1800-123-4567
          </Button>
        </div>

        <p className="mt-8 text-sm text-brand-cream/60 animate-fade-in-up animation-delay-300">
          Free consultation available • No commitment required • 100%
          confidential
        </p>
      </div>
    </section>
  );
}

export default CTASection;
