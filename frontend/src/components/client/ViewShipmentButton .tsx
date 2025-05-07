import { Package } from "lucide-react";
import { ShipmentDetailsDialog } from "./ShipmentDetailsDialog"; // path as needed
import type { Shipment } from "@/types/types";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

export const ViewShipmentButton = ({ shipment }: { shipment: Shipment }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <ShipmentDetailsDialog shipment={shipment} />
      </DialogContent>
    </Dialog>
  );
};
