import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChefHat, ClipboardList, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChefLayoutProps {
  children: ReactNode;
}

const ChefLayout = ({ children }: ChefLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: ClipboardList, label: "Orders", path: "/chef", badge: 5 },
    { icon: Package, label: "Inventory Alert", path: "/chef/inventory" },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Restaurant</h1>
              <p className="text-xs text-muted-foreground">Kitchen Panel</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start relative"
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                  {item.badge && (
                    <Badge variant="destructive" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default ChefLayout;
