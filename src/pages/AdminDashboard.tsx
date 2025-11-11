import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOffences } from "@/contexts/OffenceContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Plus, Search, FileText, AlertTriangle, DollarSign, Users } from "lucide-react";
import OffenceForm from "@/components/OffenceForm";
import OffenceTable from "@/components/OffenceTable";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { offences } = useOffences();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const filteredOffences = offences.filter(
    (off) =>
      off.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      off.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      off.offenderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFines = offences.reduce((sum, off) => sum + off.fineAmount, 0);
  const paidFines = offences
    .filter((off) => off.paymentStatus === "Paid")
    .reduce((sum, off) => sum + off.fineAmount, 0);
  const pendingFines = totalFines - paidFines;

  const offenceTypes = offences.reduce((acc, off) => {
    acc[off.offenceType] = (acc[off.offenceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonOffence = Object.entries(offenceTypes).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0] || "None";

  const repeatOffenders = Object.entries(
    offences.reduce((acc, off) => {
      acc[off.vehicleNumber] = (acc[off.vehicleNumber] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .filter(([, count]) => count > 1)
    .map(([vehicle]) => vehicle);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <nav className="bg-sidebar border-b border-sidebar-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">FRSC Admin</h1>
                <p className="text-xs text-sidebar-foreground/70">{user?.email}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="ghost" className="text-sidebar-foreground hover:bg-sidebar-accent">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Offences</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{offences.length}</div>
              <p className="text-xs text-muted-foreground">All recorded violations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{totalFines.toLocaleString()}</div>
              <p className="text-xs text-success">₦{paidFines.toLocaleString()} collected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Fines</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{pendingFines.toLocaleString()}</div>
              <p className="text-xs text-warning">
                {offences.filter((o) => o.paymentStatus === "Pending").length} unpaid
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Common Offence</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{mostCommonOffence}</div>
              <p className="text-xs text-muted-foreground">
                {repeatOffenders.length} repeat offenders
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Traffic Offences</CardTitle>
                <CardDescription>Manage and track all recorded violations</CardDescription>
              </div>
              <Button onClick={() => setShowForm(!showForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Offence
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showForm && (
              <div className="mb-6">
                <OffenceForm onSuccess={() => setShowForm(false)} />
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Vehicle Number, Offence ID, or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <OffenceTable offences={filteredOffences} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
