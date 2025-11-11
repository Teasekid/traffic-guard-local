import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Car } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { login, loginUser } = useAuth();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(adminEmail, adminPassword, "admin")) {
      navigate("/admin");
    } else {
      toast.error("Invalid admin credentials");
    }
  };

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser(vehicleNumber)) {
      navigate("/user");
    } else {
      toast.error("Please enter a vehicle number");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <Shield className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">FRSC Traffic Offence System</CardTitle>
          <CardDescription>Federal Road Safety Commission - Lafia</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin">
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </TabsTrigger>
              <TabsTrigger value="user">
                <Car className="h-4 w-4 mr-2" />
                User
              </TabsTrigger>
            </TabsList>
            <TabsContent value="admin" className="space-y-4 mt-4">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@frsc.gov.ng"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login as Admin
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Default: admin@frsc.gov.ng / 12345
                </p>
              </form>
            </TabsContent>
            <TabsContent value="user" className="space-y-4 mt-4">
              <form onSubmit={handleUserLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-number">Vehicle Number</Label>
                  <Input
                    id="vehicle-number"
                    type="text"
                    placeholder="e.g., LAG-123-AB"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" variant="secondary">
                  View My Offences
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Enter your vehicle registration number
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
