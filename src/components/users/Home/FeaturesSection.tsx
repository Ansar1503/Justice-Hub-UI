import {
  Video,
  MessageSquare,
  Phone,
  FileText,
  Shield,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Video Consultations",
    description:
      "Connect face-to-face with lawyers from anywhere through secure video calls.",
  },
  {
    icon: MessageSquare,
    title: "Chat Support",
    description:
      "Get quick answers to your legal queries through our instant messaging system.",
  },
  {
    icon: Phone,
    title: "Phone Consultations",
    description:
      "Speak directly with legal experts over the phone at your convenience.",
  },
  {
    icon: FileText,
    title: "Document Review",
    description:
      "Get your contracts and legal documents reviewed by experienced professionals.",
  },
  {
    icon: Shield,
    title: "100% Confidential",
    description:
      "Your privacy is our priority. All consultations are completely confidential.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Access legal help anytime with our round-the-clock service availability.",
  },
];

function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            How We Can Help You
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access comprehensive legal services tailored to your needs, all from
            the comfort of your home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-xl p-6 md:p-8 shadow-soft hover:shadow-elevated transition-all duration-300 border border-border hover:border-secondary/50 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
                <feature.icon className="h-7 w-7 text-brand-primary group-hover:text-secondary transition-colors" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
