import { useAppSelector } from "@/store/redux/Hook";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MessageSquare,
  FileText,
  Search,
  Clock,
  ArrowRight,
  Star,
  Video,
  Briefcase,
} from "lucide-react";

const quickActions = [
  {
    icon: Search,
    title: "Find a Lawyer",
    description: "Search by practice area",
    action: "/client/lawyers",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Calendar,
    title: "Book Consultation",
    description: "Schedule a session",
    action: "/client/book",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: MessageSquare,
    title: "My Messages",
    description: "View conversations",
    action: "/client/messages",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: FileText,
    title: "My Documents",
    description: "Access your files",
    action: "/client/documents",
    color: "bg-orange-500/10 text-orange-600",
  },
];

const upcomingAppointments = [
  {
    id: 1,
    lawyer: "Adv. Priya Sharma",
    specialty: "Family Law",
    date: "Today",
    time: "4:00 PM",
    type: "Video Call",
    avatar: "PS",
  },
  {
    id: 2,
    lawyer: "Adv. Rajesh Kumar",
    specialty: "Corporate Law",
    date: "Tomorrow",
    time: "11:00 AM",
    type: "Phone Call",
    avatar: "RK",
  },
];

const featuredLawyers = [
  {
    id: 1,
    name: "Adv. Anita Desai",
    specialty: "Criminal Law",
    rating: 4.9,
    reviews: 127,
    avatar: "AD",
    available: true,
  },
  {
    id: 2,
    name: "Adv. Vikram Singh",
    specialty: "Property Law",
    rating: 4.8,
    reviews: 98,
    avatar: "VS",
    available: true,
  },
  {
    id: 3,
    name: "Adv. Meera Patel",
    specialty: "Tax Law",
    rating: 4.9,
    reviews: 156,
    avatar: "MP",
    available: false,
  },
];

function LoggedInDashboard() {
  const user = useAppSelector((state) => state.Auth.user);
  const navigate = useNavigate();

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Here's what's happening with your legal matters.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {quickActions.map((action, index) => (
            <button
              key={action.title}
              onClick={() => navigate(action.action)}
              className="bg-card rounded-xl p-5 text-left shadow-soft hover:shadow-elevated border border-border hover:border-brand-primary/30 transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                <action.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-brand-primary transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 bg-card rounded-xl shadow-soft border border-border animate-fade-in-up animation-delay-200">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-brand-primary" />
                </div>
                <h2 className="text-xl font-display font-semibold text-foreground">
                  Upcoming Appointments
                </h2>
              </div>
              <Button variant="ghost" size="sm" className="text-brand-primary">
                View All
              </Button>
            </div>
            <div className="p-6 space-y-4">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {apt.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{apt.lawyer}</h4>
                      <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{apt.date}</p>
                    <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
                      <Video className="h-3 w-3" />
                      {apt.time}
                    </p>
                  </div>
                </div>
              ))}
              {upcomingAppointments.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">No upcoming appointments</p>
                  <Button variant="link" className="text-brand-primary mt-2">
                    Book a consultation
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-soft border border-border animate-fade-in-up animation-delay-300">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-secondary" />
                </div>
                <h2 className="text-xl font-display font-semibold text-foreground">
                  Featured Lawyers
                </h2>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {featuredLawyers.map((lawyer) => (
                <div
                  key={lawyer.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/client/lawyers/${lawyer.id}`)}
                >
                  <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    {lawyer.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate group-hover:text-brand-primary transition-colors">
                      {lawyer.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">{lawyer.specialty}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 text-secondary fill-secondary" />
                      <span className="font-medium text-foreground">{lawyer.rating}</span>
                    </div>
                    <span
                      className={`text-xs ${
                        lawyer.available ? "text-green-600" : "text-muted-foreground"
                      }`}
                    >
                      {lawyer.available ? "Available" : "Busy"}
                    </span>
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full mt-2 text-brand-primary group"
                onClick={() => navigate("/client/lawyers")}
              >
                Browse All Lawyers
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-primary rounded-xl p-6 md:p-8 text-primary-foreground animate-fade-in-up animation-delay-400">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-display font-semibold mb-2">
                Need Urgent Legal Help?
              </h3>
              <p className="text-primary-foreground/80">
                Connect with an available lawyer instantly for immediate consultation.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-accent font-semibold whitespace-nowrap"
              onClick={() => navigate("/client/urgent")}
            >
              Get Instant Help
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoggedInDashboard;
