import {
  Scale,
  Building2,
  Heart,
  Car,
  FileText,
  Users2,
  Landmark,
  Globe,
} from "lucide-react";

const practiceAreas = [
  {
    icon: Building2,
    name: "Corporate Law",
    description: "Business formation, contracts, compliance",
  },
  {
    icon: Heart,
    name: "Family Law",
    description: "Divorce, custody, adoption matters",
  },
  { icon: Car, name: "Criminal Law", description: "Defense, bail, appeals" },
  {
    icon: FileText,
    name: "Property Law",
    description: "Real estate, disputes, documentation",
  },
  {
    icon: Users2,
    name: "Employment Law",
    description: "Workplace disputes, contracts",
  },
  {
    icon: Landmark,
    name: "Tax Law",
    description: "Tax planning, disputes, compliance",
  },
  {
    icon: Globe,
    name: "Immigration Law",
    description: "Visas, citizenship, permits",
  },
  {
    icon: Scale,
    name: "Civil Litigation",
    description: "Disputes, settlements, trials",
  },
];

function PracticeAreas() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Practice Areas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our network of lawyers covers all major areas of law to serve your
            legal needs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {practiceAreas.map((area, index) => (
            <div
              key={area.name}
              className="group bg-card rounded-xl p-5 md:p-6 text-center shadow-soft hover:shadow-elevated border border-border hover:border-brand-primary/30 transition-all duration-300 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-300">
                <area.icon className="h-6 w-6 text-brand-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1 group-hover:text-brand-primary transition-colors">
                {area.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PracticeAreas;
