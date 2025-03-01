
import { NavLink } from "react-router-dom";
import { 
  BarChart3, 
  Home, 
  PackageOpen, 
  Layers, 
  TrendingUp, 
  FileText, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: PackageOpen, label: "Bahan Baku", path: "/materials" },
  { icon: Layers, label: "Stok", path: "/stock" },
  { icon: TrendingUp, label: "Prediksi", path: "/prediction" },
  { icon: FileText, label: "Laporan", path: "/reports" },
];

const Sidebar = ({ isOpen, isMobile, toggleSidebar }: SidebarProps) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full bg-white shadow-lg z-30 transition-all duration-300 ease-in-out",
          isOpen ? "w-64 translate-x-0" : isMobile ? "-translate-x-full w-64" : "w-0",
          "flex flex-col"
        )}
      >
        <div className="flex items-center justify-between py-5 px-4 border-b">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-medium">DoughStock</h2>
          </div>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="md:hidden"
            >
              <X size={18} />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
