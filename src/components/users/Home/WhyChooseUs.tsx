import { CheckCircle2, Users, Award, Briefcase } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Happy Clients" },
  { icon: Award, value: "500+", label: "Expert Lawyers" },
  { icon: Briefcase, value: "25,000+", label: "Cases Handled" },
  { icon: CheckCircle2, value: "98%", label: "Success Rate" },
];

const benefits = [
  "Verified and experienced legal professionals",
  "Affordable consultation fees",
  "Multiple consultation modes - chat, call, video",
  "Quick response within 24 hours",
  "Pan-India legal coverage",
  "Secure and confidential platform",
];

function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
              Why Choose{" "}
              <span className="text-gradient-gold">Justice Hub?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We connect you with India's finest legal minds. Our platform
              ensures you get the right legal guidance at the right time,
              without any hassle.
            </p>

            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 animate-slide-in-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Stats */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-card rounded-xl p-6 md:p-8 text-center shadow-soft border border-border animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-brand-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
