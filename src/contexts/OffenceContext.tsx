import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export interface Offence {
  id: string;
  offenderName: string;
  vehicleNumber: string;
  offenceType: string;
  location: string;
  dateTime: string;
  fineAmount: number;
  paymentStatus: "Pending" | "Paid";
}

interface OffenceContextType {
  offences: Offence[];
  addOffence: (offence: Omit<Offence, "id">) => void;
  updateOffence: (id: string, offence: Partial<Offence>) => void;
  deleteOffence: (id: string) => void;
  getOffencesByVehicle: (vehicleNumber: string) => Offence[];
  payFine: (id: string) => void;
}

const OffenceContext = createContext<OffenceContextType | undefined>(undefined);

const STORAGE_KEY = "frsc_offences";

const seedData: Offence[] = [
  {
    id: "OFF001",
    offenderName: "Adewale Johnson",
    vehicleNumber: "LAG-123-AB",
    offenceType: "Speeding",
    location: "Lafia-Makurdi Road",
    dateTime: "2025-01-10T14:30:00",
    fineAmount: 15000,
    paymentStatus: "Pending",
  },
  {
    id: "OFF002",
    offenderName: "Fatima Mohammed",
    vehicleNumber: "NAS-456-CD",
    offenceType: "Seatbelt Violation",
    location: "Lafia Central Market",
    dateTime: "2025-01-11T09:15:00",
    fineAmount: 5000,
    paymentStatus: "Paid",
  },
  {
    id: "OFF003",
    offenderName: "Chukwudi Okafor",
    vehicleNumber: "LAG-789-EF",
    offenceType: "Dangerous Driving",
    location: "Shabu Junction",
    dateTime: "2025-01-11T16:45:00",
    fineAmount: 25000,
    paymentStatus: "Pending",
  },
];

export const OffenceProvider = ({ children }: { children: ReactNode }) => {
  const [offences, setOffences] = useState<Offence[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setOffences(JSON.parse(stored));
    } else {
      setOffences(seedData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    }
  }, []);

  const saveToStorage = (data: Offence[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setOffences(data);
  };

  const addOffence = (offence: Omit<Offence, "id">) => {
    const newOffence = {
      ...offence,
      id: `OFF${String(offences.length + 1).padStart(3, "0")}`,
    };
    const updated = [...offences, newOffence];
    saveToStorage(updated);
    toast.success("Offence recorded successfully");
  };

  const updateOffence = (id: string, updates: Partial<Offence>) => {
    const updated = offences.map((off) =>
      off.id === id ? { ...off, ...updates } : off
    );
    saveToStorage(updated);
    toast.success("Offence updated successfully");
  };

  const deleteOffence = (id: string) => {
    const updated = offences.filter((off) => off.id !== id);
    saveToStorage(updated);
    toast.success("Offence deleted successfully");
  };

  const getOffencesByVehicle = (vehicleNumber: string) => {
    return offences.filter(
      (off) => off.vehicleNumber.toLowerCase() === vehicleNumber.toLowerCase()
    );
  };

  const payFine = (id: string) => {
    updateOffence(id, { paymentStatus: "Paid" });
    toast.success("Payment recorded successfully");
  };

  return (
    <OffenceContext.Provider
      value={{
        offences,
        addOffence,
        updateOffence,
        deleteOffence,
        getOffencesByVehicle,
        payFine,
      }}
    >
      {children}
    </OffenceContext.Provider>
  );
};

export const useOffences = () => {
  const context = useContext(OffenceContext);
  if (!context) {
    throw new Error("useOffences must be used within OffenceProvider");
  }
  return context;
};
