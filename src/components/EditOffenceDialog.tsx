import { useState } from "react";
import { Offence, useOffences } from "@/contexts/OffenceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const offenceTypes = [
  "Speeding",
  "Seatbelt Violation",
  "Dangerous Driving",
  "Overloading",
  "Driving Without License",
  "Phone Use While Driving",
  "Traffic Light Violation",
  "Wrong Way Driving",
  "Drunk Driving",
  "Expired Documents",
];

interface EditOffenceDialogProps {
  offence: Offence;
  onClose: () => void;
}

const EditOffenceDialog = ({ offence, onClose }: EditOffenceDialogProps) => {
  const { updateOffence } = useOffences();
  const [formData, setFormData] = useState({
    offenderName: offence.offenderName,
    vehicleNumber: offence.vehicleNumber,
    offenceType: offence.offenceType,
    location: offence.location,
    dateTime: offence.dateTime,
    fineAmount: offence.fineAmount.toString(),
    paymentStatus: offence.paymentStatus,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateOffence(offence.id, {
      ...formData,
      fineAmount: parseFloat(formData.fineAmount),
    });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Offence - {offence.id}</DialogTitle>
          <DialogDescription>Update the offence record details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-offenderName">Offender Name</Label>
              <Input
                id="edit-offenderName"
                value={formData.offenderName}
                onChange={(e) => setFormData({ ...formData, offenderName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-vehicleNumber">Vehicle Number</Label>
              <Input
                id="edit-vehicleNumber"
                value={formData.vehicleNumber}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-offenceType">Offence Type</Label>
              <Select
                value={formData.offenceType}
                onValueChange={(value) => setFormData({ ...formData, offenceType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {offenceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dateTime">Date & Time</Label>
              <Input
                id="edit-dateTime"
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-fineAmount">Fine Amount (₦)</Label>
              <Input
                id="edit-fineAmount"
                type="number"
                value={formData.fineAmount}
                onChange={(e) => setFormData({ ...formData, fineAmount: e.target.value })}
                min="0"
                step="1000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-paymentStatus">Payment Status</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value: "Pending" | "Paid") =>
                  setFormData({ ...formData, paymentStatus: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOffenceDialog;
