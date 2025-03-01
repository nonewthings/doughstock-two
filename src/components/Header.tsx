
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
  return (
    <header className="bg-primary text-primary-foreground shadow-md py-3 px-4 sm:px-6 lg:px-8 flex items-center justify-between z-10">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="text-white hover:bg-primary/80 mr-2"
        >
          <Menu size={20} />
        </Button>
        <h1 className="text-xl font-semibold">Doughstock Optimizer</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:block text-sm">
          <span>Tanggal: </span>
          <span>{format(new Date(), "dd MMM yyyy")}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
