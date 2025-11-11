import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOffences, Offence } from "@/contexts/OffenceContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Car, AlertCircle, CheckCircle2, Clock, Receipt } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PaymentModal from "@/components/PaymentModal";
import PaymentReceipt from "@/components/PaymentReceipt";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { getOffencesByVehicle, payFine } = useOffences();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "Paid" | "Pending">("all");
  const [selectedOffence, setSelectedOffence] = useState<Offence | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptOffence, setReceiptOffence] = useState<Offence | null>(null);

  const vehicleNumber = user?.email || "";
  const userOffences = getOffencesByVehicle(vehicleNumber);

  const filteredOffences =
    filter === "all"
      ? userOffences
      : userOffences.filter((off) => off.paymentStatus === filter);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handlePayClick = (offence: Offence) => {
    setSelectedOffence(offence);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (transactionId: string, gatewayRef: string) => {
    if (selectedOffence) {
      payFine(selectedOffence.id, transactionId, gatewayRef);
    }
  };

  const handleViewReceipt = (offence: Offence) => {
    setReceiptOffence(offence);
    setShowReceiptModal(true);
  };

  const totalFines = userOffences.reduce((sum, off) => sum + off.fineAmount, 0);
  const paidAmount = userOffences
    .filter((off) => off.paymentStatus === "Paid")
    .reduce((sum, off) => sum + off.fineAmount, 0);
  const pendingAmount = totalFines - paidAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <nav className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Car className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold">My Offences</h1>
                <p className="text-xs text-muted-foreground">{vehicleNumber}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Offences</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userOffences.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">₦{pendingAmount.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">₦{paidAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Your Traffic Offences</CardTitle>
                <CardDescription>View and manage your violation records</CardDescription>
              </div>
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Offences</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredOffences.length === 0 ? (
              <div className="text-center py-12">
                <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {userOffences.length === 0
                    ? "No offences found for this vehicle number"
                    : "No offences match your filter"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOffences.map((offence) => (
                  <Card key={offence.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{offence.id}</Badge>
                            <Badge
                              variant={
                                offence.paymentStatus === "Paid" ? "default" : "destructive"
                              }
                            >
                              {offence.paymentStatus}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg">{offence.offenceType}</h3>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                              <strong>Offender:</strong> {offence.offenderName}
                            </p>
                            <p>
                              <strong>Location:</strong> {offence.location}
                            </p>
                            <p>
                              <strong>Date:</strong>{" "}
                              {new Date(offence.dateTime).toLocaleString()}
                            </p>
                            <p className="text-lg font-semibold text-foreground mt-2">
                              Fine: ₦{offence.fineAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          {offence.paymentStatus === "Pending" ? (
                            <Button
                              onClick={() => handlePayClick(offence)}
                              className="w-full sm:w-auto"
                            >
                              Pay Fine
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleViewReceipt(offence)}
                              variant="outline"
                              className="w-full sm:w-auto"
                            >
                              <Receipt className="h-4 w-4 mr-2" />
                              View Receipt
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {selectedOffence && (
        <PaymentModal
          open={showPaymentModal}
          onOpenChange={setShowPaymentModal}
          offence={selectedOffence}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {receiptOffence && receiptOffence.transactionId && receiptOffence.gatewayRef && receiptOffence.paymentDate && (
        <PaymentReceipt
          open={showReceiptModal}
          onOpenChange={setShowReceiptModal}
          offence={receiptOffence}
          transactionId={receiptOffence.transactionId}
          gatewayRef={receiptOffence.gatewayRef}
          paymentDate={receiptOffence.paymentDate}
        />
      )}
    </div>
  );
};

export default UserDashboard;
