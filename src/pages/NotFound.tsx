
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 animate-fade-in">
      <div className="p-4 rounded-full bg-muted mb-6">
        <FileQuestion className="h-16 w-16 text-primary" />
      </div>
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8 text-center max-w-md">
        Maaf, halaman yang Anda cari tidak dapat ditemukan.
      </p>
      <Button className="bg-primary hover:bg-primary/90" asChild>
        <a href="/">Kembali ke Dashboard</a>
      </Button>
    </div>
  );
};

export default NotFound;
