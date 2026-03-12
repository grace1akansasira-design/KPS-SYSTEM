import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Loader2, Mail, Lock, AlertCircle, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Please enter your email address"); return; }
    if (!password) { setError("Please enter your password"); return; }

    const result = await login(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Login failed. Please try again.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regName.trim()) { setRegError("Please enter your full name"); return; }
    if (!regEmail.trim()) { setRegError("Please enter your email address"); return; }
    if (!regPassword) { setRegError("Please enter a password"); return; }
    if (regPassword.length < 6) { setRegError("Password must be at least 6 characters"); return; }
    if (regPassword !== regConfirmPassword) { setRegError("Passwords do not match"); return; }

    setRegLoading(true);
    const { error } = await supabase.auth.signUp({
      email: regEmail.toLowerCase().trim(),
      password: regPassword,
      options: {
        emailRedirectTo: window.location.origin,
        data: { name: regName.trim() },
      },
    });

    if (error) {
      setRegError(error.message);
      setRegLoading(false);
      return;
    }

    // Auto-login after signup (email auto-confirm is enabled)
    const loginResult = await login(regEmail, regPassword);
    setRegLoading(false);
    if (loginResult.success) {
      toast({ title: "Account Created", description: "Welcome! Your account has been created successfully." });
      navigate("/");
    } else {
      toast({ title: "Account Created", description: "Please sign in with your new credentials." });
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url('/image 23.jpg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Refined semi-transparent overlay for premium feel */}
      <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-[1px] z-0" />
      
      <div className="w-full max-w-md space-y-6 relative z-10 animate-in fade-in duration-1000">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-2 drop-shadow-2xl">
            <img src="/school%20budge.png.png" alt="KPS Logo" className="w-full h-full object-contain" />
          </div>
          
          <div className="bg-blue-600/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl border border-white/20 transform hover:scale-[1.02] transition-transform duration-500">
            <h1 className="text-3xl font-black tracking-tight text-white uppercase leading-tight">
              KABALE PREPARATORY SCHOOL
            </h1>
            <div className="h-0.5 w-20 bg-white/40 mx-auto my-3 rounded-full" />
            <p className="text-white text-lg font-black uppercase tracking-[0.2em]">Timetable Management System</p>
          </div>
        </div>

        <Card className="border-white/40 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] bg-blue-50/95 backdrop-blur-xl border-t border-l rounded-[2.5rem] overflow-hidden">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="space-y-1 pb-4 bg-blue-600/5">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-blue-100/50 rounded-2xl">
                <TabsTrigger value="login" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300">Sign In</TabsTrigger>
                <TabsTrigger value="register" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300">Register</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="p-8">
              <TabsContent value="login" className="mt-0 outline-none">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <Alert variant="destructive" className="animate-fade-in">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="you@kps.ac.ug" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" disabled={isLoading} autoComplete="email" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" disabled={isLoading} autoComplete="current-password" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
                    {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>) : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <form onSubmit={handleRegister} className="space-y-4">
                  {regError && (
                    <Alert variant="destructive" className="animate-fade-in">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{regError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="reg-name" placeholder="Your full name" value={regName} onChange={(e) => setRegName(e.target.value)} className="pl-10" disabled={regLoading} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="reg-email" type="email" placeholder="you@kps.ac.ug" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="pl-10" disabled={regLoading} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="reg-password" type="password" placeholder="Min 6 characters" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="pl-10" disabled={regLoading} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="reg-confirm" type="password" placeholder="Repeat password" value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} className="pl-10" disabled={regLoading} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11 text-base font-medium" disabled={regLoading}>
                    {regLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Account...</>) : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

      </div>
    </div>
  );
};

export default Login;
