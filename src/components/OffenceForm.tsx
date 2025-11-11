import { useState } from "react";
import { useOffences } from "@/contexts/OffenceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface OffenceFormProps {
  onSuccess?: () => void;
}

const OffenceForm = ({ onSuccess }: OffenceFormProps) => {
  const { addOffence } = useOffences();
  const [formData, setFormData] = useState({
    offenderName: "",
    vehicleNumber: "",
    offenceType: "",
    location: "",
    dateTime: new Date().toISOString().slice(0, 16),
    fineAmount: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOffence({
      ...formData,
      fineAmount: parseFloat(formData.fineAmount),
      paymentStatus: "Pending",
    });
    setFormData({
      offenderName: "",
      vehicleNumber: "",
      offenceType: "",
      location: "",
      dateTime: new Date().toISOString().slice(0, 16),
      fineAmount: "",
    });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-muted/50 rounded-lg border-2">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="offenderName">Offender Name</Label>
          <Input
            id="offenderName"
            value={formData.offenderName}
            onChange={(e) => setFormData({ ...formData, offenderName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleNumber">Vehicle Number</Label>
          <Input
            id="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={(e) =>
              setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })
            }
            placeholder="e.g., LAG-123-AB"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="offenceType">Offence Type</Label>
          <Select
            value={formData.offenceType}
            onValueChange={(value) => setFormData({ ...formData, offenceType: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select offence type" />
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
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateTime">Date & Time</Label>
          <Input
            id="dateTime"
            type="datetime-local"
            value={formData.dateTime}
            onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fineAmount">Fine Amount (₦)</Label>
          <Input
            id="fineAmount"
            type="number"
            value={formData.fineAmount}
            onChange={(e) => setFormData({ ...formData, fineAmount: e.target.value })}
            min="0"
            step="1000"
            required
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Record Offence
        </Button>
        {onSuccess && (
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default OffenceForm;
