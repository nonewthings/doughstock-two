
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, User, Lock } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Login berhasil",
        description: "Anda berhasil masuk ke sistem",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login gagal",
        description: error.message,
      });
      console.error("Error signing in:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1A3C34] to-[#2D6E5D] p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-xl overflow-hidden bg-white/95 backdrop-blur-sm">
          <div className="bg-[#104E3C] h-1.5 w-full"></div>
          <CardHeader className="space-y-2 text-center pt-10 pb-6">
            <CardTitle className="text-3xl font-bold text-[#104E3C]">Doughstock Optimizer</CardTitle>
            <CardDescription className="text-[#2D6E5D]/80">
              Sistem Manajemen Stok
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSignIn}>
            <CardContent className="space-y-6 pt-4 px-8">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#104E3C]">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#2D6E5D]/70">
                    <User size={18} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email Admin"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-[#104E3C]/20 focus-visible:ring-[#104E3C]/30 focus-visible:border-[#104E3C]/30"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-[#104E3C]">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#2D6E5D]/70">
                    <Lock size={18} />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-[#104E3C]/20 focus-visible:ring-[#104E3C]/30 focus-visible:border-[#104E3C]/30"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-10 px-8 pt-4">
              <Button 
                className="w-full h-11 text-base font-medium bg-[#104E3C] hover:bg-[#0A3B2D] shadow-md hover:shadow-lg transition-all"
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
