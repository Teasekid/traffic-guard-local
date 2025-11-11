import { useState } from "react";
import { Offence, useOffences } from "@/contexts/OffenceContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import EditOffenceDialog from "./EditOffenceDialog";

interface OffenceTableProps {
  offences: Offence[];
}

const OffenceTable = ({ offences }: OffenceTableProps) => {
  const { deleteOffence } = useOffences();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editOffence, setEditOffence] = useState<Offence | null>(null);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Offender</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Offence</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Fine</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No offences found
                </TableCell>
              </TableRow>
            ) : (
              offences.map((offence) => (
                <TableRow key={offence.id}>
                  <TableCell className="font-medium">{offence.id}</TableCell>
                  <TableCell>{offence.offenderName}</TableCell>
                  <TableCell>{offence.vehicleNumber}</TableCell>
                  <TableCell>{offence.offenceType}</TableCell>
                  <TableCell>{offence.location}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(offence.dateTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell>₦{offence.fineAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={offence.paymentStatus === "Paid" ? "default" : "destructive"}
                    >
                      {offence.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setEditOffence(offence)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => setDeleteId(offence.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this offence record? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) deleteOffence(deleteId);
                setDeleteId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editOffence && (
        <EditOffenceDialog
          offence={editOffence}
          onClose={() => setEditOffence(null)}
        />
      )}
    </>
  );
};

export default OffenceTable;
