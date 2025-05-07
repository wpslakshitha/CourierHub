import {
  Package,
  MapPin,
  Clock,
  Truck,
  User,
  Phone,
  Mail,
  Building,
  Box,
  FileText,
  CheckCircle,
  AlertTriangle,
  CalendarClock,
  CircleDollarSign,
  Clipboard,
  Globe,
  AlertCircle,
  PenLine,
  BadgeIcon,
} from "lucide-react";

import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import type { Shipment } from "@/types/types";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

const getStatusInfo = (status: string) => {
  switch (status) {
    case "pending":
      return {
        icon: <Clock size={18} className="text-amber-500" />,
        color: "bg-amber-100 border-amber-300 text-amber-700",
        bgColor: "bg-amber-50",
        progressColor: "bg-amber-500",
        progress: 25,
        label: "Pending",
      };
    case "in_transit":
      return {
        icon: <Truck size={18} className="text-blue-500" />,
        color: "bg-blue-100 border-blue-300 text-blue-700",
        bgColor: "bg-blue-50",
        progressColor: "bg-blue-500",
        progress: 75,
        label: "In Transit",
      };
    case "delivered":
      return {
        icon: <CheckCircle size={18} className="text-emerald-500" />,
        color: "bg-emerald-100 border-emerald-300 text-emerald-700",
        bgColor: "bg-emerald-50",
        progressColor: "bg-emerald-500",
        progress: 100,
        label: "Delivered",
      };
    case "cancelled":
      return {
        icon: <AlertTriangle size={18} className="text-rose-500" />,
        color: "bg-rose-100 border-rose-300 text-rose-700",
        bgColor: "bg-rose-50",
        progressColor: "bg-rose-500",
        progress: 0,
        label: "Cancelled",
      };
    default:
      return {
        icon: <Package size={18} className="text-gray-500" />,
        color: "bg-gray-100 border-gray-300 text-gray-700",
        bgColor: "bg-gray-50",
        progressColor: "bg-gray-500",
        progress: 0,
        label: "Unknown",
      };
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "Not specified";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const calculateDeliveryTimeLeft = (estimatedDate?: string) => {
  if (!estimatedDate) return null;

  const now = new Date();
  const delivery = new Date(estimatedDate);

  // If delivery date has passed
  if (delivery < now) return "Delivery date passed";

  const diffTime = Math.abs(delivery.getTime() - now.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ${diffHours} hour${
      diffHours > 1 ? "s" : ""
    }`;
  } else {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  }
};

interface ShipmentDetailsDialogProps {
  shipment: Shipment;
}

export const ShipmentDetailsDialog = ({
  shipment,
}: ShipmentDetailsDialogProps) => {
  const statusInfo = getStatusInfo(shipment.status);
  const deliveryTimeLeft = calculateDeliveryTimeLeft(
    shipment.estimated_delivery_date?.toString()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Shipment Details
              </h2>
              <p className="text-blue-100">
                Tracking #{shipment.tracking_number}
              </p>
            </div>
          </div>
          <Badge
            className={`${statusInfo.color} border px-3 py-1 text-sm font-medium flex items-center gap-2`}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        </div>
      </div>

      {/* Delivery Progress */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-700">Delivery Progress</h3>
            {deliveryTimeLeft && (
              <div className="flex items-center gap-1 text-sm">
                <CalendarClock size={14} className="text-blue-500" />
                <span>{deliveryTimeLeft} left</span>
              </div>
            )}
          </div>
          <Progress value={statusInfo.progress} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Order Placed</span>
            <span>Processing</span>
            <span>In Transit</span>
            <span>Delivered</span>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="details">
            <div className="flex items-center gap-1">
              <Clipboard size={14} />
              <span>Details</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="parties">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>Parties</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="notes">
            <div className="flex items-center gap-1">
              <FileText size={14} />
              <span>Notes</span>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shipping Method */}
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Truck size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shipping Method</p>
                  <p className="font-medium">{shipment.shipping_method}</p>
                </div>
              </div>
            </Card>

            {/* Package Type */}
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Box size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Package Type</p>
                  <p className="font-medium">{shipment.package_type}</p>
                </div>
              </div>
            </Card>

            {/* Weight */}
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <BadgeIcon size={18} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium">{shipment.weight} kg</p>
                </div>
              </div>
            </Card>

            {/* Cost */}
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <CircleDollarSign size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shipping Cost</p>
                  <p className="font-medium">${shipment.shipping_cost}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Dates */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-700 mb-3">Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Clock size={16} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created Date</p>
                  <p>{formatDate(shipment.created_at?.toString())}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CalendarClock size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <p>
                    {formatDate(shipment.estimated_delivery_date?.toString())}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Parties Tab */}
        <TabsContent value="parties" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sender */}
            <Card className="p-5 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium">Sender</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <PenLine size={14} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-medium">{shipment.sender_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Mail size={14} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{shipment.sender_email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Phone size={14} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm">{shipment.sender_phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <MapPin size={14} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm">{shipment.sender_address}</p>
                    <p className="text-sm">{`${shipment.sender_city}, ${shipment.sender_state} ${shipment.sender_zip}`}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Globe size={14} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Country</p>
                    <p className="text-sm">{shipment.sender_country}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recipient */}
            <Card className="p-5 border-l-4 border-l-purple-500">
              <div className="flex items-center gap-2 mb-4">
                <Building className="h-5 w-5 text-purple-500" />
                <h3 className="text-lg font-medium">Recipient</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <PenLine size={14} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-medium">{shipment.recipient_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <Mail size={14} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{shipment.recipient_email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <Phone size={14} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm">{shipment.recipient_phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <MapPin size={14} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm">{shipment.recipient_address}</p>
                    <p className="text-sm">{`${shipment.recipient_city}, ${shipment.recipient_state} ${shipment.recipient_zip}`}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <Globe size={14} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Country</p>
                    <p className="text-sm">{shipment.recipient_country}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          {/* Delivery Notes */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-medium">Delivery Notes</h3>
            </div>
            <p className="bg-amber-50 p-3 rounded-lg text-gray-700">
              {shipment.delivery_notes || "No delivery notes specified"}
            </p>
          </Card>

          {/* Special Instructions */}
          {shipment.special_instructions && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
                <h3 className="text-lg font-medium">Special Instructions</h3>
              </div>
              <p className="bg-rose-50 p-3 rounded-lg text-gray-700">
                {shipment.special_instructions}
              </p>
            </Card>
          )}

          {/* Description */}
          {shipment.description && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium">Package Description</h3>
              </div>
              <p className="bg-blue-50 p-3 rounded-lg text-gray-700">
                {shipment.description}
              </p>
            </Card>
          )}

          {/* If no notes or descriptions */}
          {!shipment.delivery_notes &&
            !shipment.special_instructions &&
            !shipment.description && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <FileText size={40} className="mb-3 opacity-30" />
                <p>No additional notes or descriptions available</p>
              </div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
