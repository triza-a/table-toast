import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat, Utensils, ClipboardList, Users, BarChart3 } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 4000);

    const navigateTimer = setTimeout(() => {
      navigate("/login");
    }, 4800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navigateTimer);
    };
  }, [navigate]);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex flex-col items-center justify-center p-6 transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Main Logo and Title */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="mx-auto w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-6 shadow-2xl animate-bounce-slow">
          <ChefHat className="w-12 h-12 text-primary-foreground" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
          Restaurant Manager
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
          Streamline your restaurant operations with our all-in-one management solution
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl animate-slide-up">
        <FeatureCard icon={Utensils} label="Menu Management" delay="0" />
        <FeatureCard icon={ClipboardList} label="Order Tracking" delay="100" />
        <FeatureCard icon={Users} label="Staff Control" delay="200" />
        <FeatureCard icon={BarChart3} label="Analytics" delay="300" />
      </div>

      {/* Loading indicator */}
      <div className="flex flex-col items-center gap-4 animate-pulse-slow">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <p className="text-muted-foreground text-sm">Loading your experience...</p>
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon: Icon,
  label,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  delay: string;
}) => (
  <div
    className="flex flex-col items-center gap-3 p-6 bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
      <Icon className="w-7 h-7 text-primary" />
    </div>
    <span className="text-sm font-medium text-foreground text-center">{label}</span>
  </div>
);

export default Landing;
