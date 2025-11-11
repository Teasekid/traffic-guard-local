import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Offence } from "@/contexts/OffenceContext";

interface PaymentReceiptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offence: Offence;
  transactionId: string;
  gatewayRef: string;
  paymentDate: string;
}

const PaymentReceipt = ({
  open,
  onOpenChange,
  offence,
  transactionId,
  gatewayRef,
  paymentDate,
}: PaymentReceiptProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] print:shadow-none print:border-0">
        <div id="receipt-content" className="space-y-6">
          {/* Header */}
          <div className="text-center border-b border-border pb-4 print:border-black">
            <h1 className="text-2xl font-bold text-primary print:text-black">
              Federal Road Safety Commission
            </h1>
            <p className="text-sm text-muted-foreground print:text-gray-700">
              Lafia Command, Nasarawa State
            </p>
            <p className="text-xs text-muted-foreground mt-1 print:text-gray-600">
              Official Payment Receipt
            </p>
          </div>

          {/* Receipt Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground print:text-gray-600">Receipt No.</p>
                <p className="font-semibold print:text-black">{transactionId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground print:text-gray-600">Date</p>
                <p className="font-semibold print:text-black">
                  {new Date(paymentDate).toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>

            <div className="border-t border-b border-border py-4 print:border-black">
              <h2 className="font-semibold mb-3 print:text-black">Offence Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground print:text-gray-700">Offence ID:</span>
                  <span className="font-medium print:text-black">{offence.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground print:text-gray-700">Offender Name:</span>
                  <span className="font-medium print:text-black">{offence.offenderName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground print:text-gray-700">Vehicle Number:</span>
                  <span className="font-medium print:text-black">{offence.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground print:text-gray-700">Offence Type:</span>
                  <span className="font-medium print:text-black">{offence.offenceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground print:text-gray-700">Location:</span>
                  <span className="font-medium print:text-black">{offence.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground print:text-gray-700">Date of Offence:</span>
                  <span className="font-medium print:text-black">
                    {new Date(offence.dateTime).toLocaleString("en-GB")}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-b border-border pb-4 print:border-black">
              <h2 className="font-semibold mb-3 print:text-black">Payment Information</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground print:text-gray-700">Transaction ID:</span>
                  <span className="font-medium print:text-black">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground print:text-gray-700">Gateway Reference:</span>
                  <span className="font-medium print:text-black">{gatewayRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground print:text-gray-700">Payment Date:</span>
                  <span className="font-medium print:text-black">
                    {new Date(paymentDate).toLocaleString("en-GB")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground print:text-gray-700">Payment Status:</span>
                  <span className="font-medium text-success print:text-black">Paid</span>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg print:bg-gray-100">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg print:text-black">Total Amount Paid:</span>
                <span className="font-bold text-2xl text-primary print:text-black">
                  ₦{offence.fineAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-4 print:pt-8">
              <div className="border-t border-border pt-4 print:border-black">
                <p className="text-xs text-muted-foreground mb-4 print:text-gray-600">
                  Authorized Signature:
                </p>
                <div className="border-b border-border w-64 print:border-black"></div>
                <p className="text-xs text-muted-foreground mt-1 print:text-gray-600">
                  FRSC Officer
                </p>
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground pt-4 print:text-gray-600">
              <p>This is an official computer-generated receipt.</p>
              <p>For inquiries, contact FRSC Lafia Command.</p>
            </div>
          </div>

          {/* Print Button - Hidden in print */}
          <div className="flex gap-3 pt-4 print:hidden">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Close
            </Button>
            <Button onClick={handlePrint} className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentReceipt;
