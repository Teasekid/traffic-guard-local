import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Offence } from "@/contexts/OffenceContext";
import PaymentReceipt from "./PaymentReceipt";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offence: Offence;
  onPaymentSuccess: (transactionId: string, gatewayRef: string) => void;
}

const PaymentModal = ({ open, onOpenChange, offence, onPaymentSuccess }: PaymentModalProps) => {
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionData, setTransactionData] = useState<{
    transactionId: string;
    gatewayRef: string;
    paymentDate: string;
  } | null>(null);

  const validateForm = () => {
    if (!cardholderName.trim()) {
      toast.error("Please enter cardholder name");
      return false;
    }
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      toast.error("Card number must be 16 digits");
      return false;
    }
    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
      toast.error("Expiry date must be in MM/YY format");
      return false;
    }
    if (cvv.length !== 3) {
      toast.error("CVV must be 3 digits");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setProcessing(true);

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Generate transaction details
    const transactionId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const gatewayRef = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const paymentDate = new Date().toISOString();

    setTransactionData({ transactionId, gatewayRef, paymentDate });
    setProcessing(false);
    setShowReceipt(true);
    
    onPaymentSuccess(transactionId, gatewayRef);
    toast.success("Payment Successful – Receipt Ready");
  };

  const handleClose = () => {
    setCardholderName("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setProcessing(false);
    setShowReceipt(false);
    setTransactionData(null);
    onOpenChange(false);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(" ");
  };

  if (showReceipt && transactionData) {
    return (
      <PaymentReceipt
        open={open}
        onOpenChange={handleClose}
        offence={offence}
        transactionId={transactionData.transactionId}
        gatewayRef={transactionData.gatewayRef}
        paymentDate={transactionData.paymentDate}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Payment Gateway</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Offence ID:</span>
              <span className="font-semibold">{offence.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vehicle Number:</span>
              <span className="font-semibold">{offence.vehicleNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Offence Type:</span>
              <span className="font-semibold">{offence.offenceType}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-border pt-2 mt-2">
              <span>Total Amount:</span>
              <span className="text-primary">₦{offence.fineAmount.toLocaleString()}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                disabled={processing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                disabled={processing}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + "/" + value.slice(2, 4);
                    }
                    setExpiryDate(value);
                  }}
                  disabled={processing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  maxLength={3}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  disabled={processing}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={processing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={processing} className="flex-1">
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit Payment"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
