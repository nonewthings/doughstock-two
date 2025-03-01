
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari sistem",
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
        
        {user && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSignOut}
            className="text-white hover:bg-primary/80 flex items-center"
          >
            <LogOut size={16} className="mr-1" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
