import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Calendar,
  MapPin,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ViewShipmentButton } from "./ViewShipmentButton ";

// Types
interface Shipment {
  id?: number; // Optional for new records (auto-generated)
  tracking_number: string;

  // Sender information
  user_id: number;
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  sender_address: string;
  sender_city: string;
  sender_state: string;
  sender_zip: string;
  sender_country: string;

  // Recipient details
  recipient_name: string;
  recipient_email: string;
  recipient_phone?: string;
  recipient_address: string;
  recipient_city: string;
  recipient_state: string;
  recipient_zip: string;
  recipient_country: string;

  // Shipment details
  package_type: string;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  description?: string;
  declared_value?: number;
  delivery_notes?: string;

  // Shipping options
  shipping_method: string;
  insurance: boolean;
  signature_required: boolean;

  // System fields
  estimated_delivery_date: Date;
  shipping_cost: number;
  special_instructions?: string;
  status: "pending" | "in_transit" | "delivered" | "cancelled";
  created_at?: Date;
  updated_at?: Date;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date_desc");
  const [expandedShipment, setExpandedShipment] = useState<string | null>(null);

  // Fetch shipments data
  useEffect(() => {
    const fetchShipments = async (userId: number) => {
      try {
        setIsLoading(true);

        const response = await fetch(`/api/shipments/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        setShipments(data);
        setFilteredShipments(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching shipments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.user_id) {
      fetchShipments(user.user_id);
    }
  }, []);

  // Filter and sort shipments
  useEffect(() => {
    let result = [...shipments];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((shipment) => shipment.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (shipment) =>
          shipment.tracking_number.toLowerCase().includes(term) ||
          shipment.description?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "date_asc":
          return (
            new Date(a.created_at || "").getTime() -
            new Date(b.created_at || "").getTime()
          );
        case "date_desc":
          return (
            new Date(b.created_at || "").getTime() -
            new Date(a.created_at || "").getTime()
          );
        case "delivery_asc":
          return (
            new Date(a.estimated_delivery_date).getTime() -
            new Date(b.estimated_delivery_date).getTime()
          );
        case "delivery_desc":
          return (
            new Date(b.estimated_delivery_date).getTime() -
            new Date(a.estimated_delivery_date).getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredShipments(result);
  }, [shipments, searchTerm, statusFilter, sortBy]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock size={18} />,
          color: "text-amber-500 bg-amber-50",
          label: "Pending",
        };
      case "in_transit":
        return {
          icon: <Truck size={18} />,
          color: "text-blue-500 bg-blue-50",
          label: "In Transit",
        };
      case "delivered":
        return {
          icon: <CheckCircle size={18} />,
          color: "text-green-500 bg-green-50",
          label: "Delivered",
        };
      case "cancelled":
        return {
          icon: <AlertTriangle size={18} />,
          color: "text-red-500 bg-red-50",
          label: "Cancelled",
        };
      default:
        return {
          icon: <Package size={18} />,
          color: "text-gray-500 bg-gray-50",
          label: "Unknown",
        };
    }
  };

  // Toggle shipment details
  const toggleShipmentDetails = (id: string) => {
    if (expandedShipment === id) {
      setExpandedShipment(null);
    } else {
      setExpandedShipment(id);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // const ShipmentDetailsDialog = ({ shipment }: { shipment: Shipment }) => {
  // const statusInfo = getStatusInfo(shipment.status);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Shipment Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track all your shipments in one place
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/create-shipment"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Shipment
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Search by tracking number, location, or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative inline-block text-left">
                <div className="flex">
                  <label className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Status
                  </label>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-r-md"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="relative inline-block text-left">
                <div className="flex">
                  <label className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Sort
                  </label>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-r-md"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="date_desc">Date (Newest first)</option>
                    <option value="date_asc">Date (Oldest first)</option>
                    <option value="delivery_asc">
                      Delivery (Soonest first)
                    </option>
                    <option value="delivery_desc">
                      Delivery (Latest first)
                    </option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setSortBy("date_desc");
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Shipments List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No shipments found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first shipment to get started"}
            </p>
            <div className="mt-6">
              <Link
                to="/create-shipment"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Shipment
              </Link>
            </div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredShipments.map((shipment) => {
              const statusInfo = getStatusInfo(shipment.status);
              const isExpanded = expandedShipment === shipment.id?.toString();

              return (
                <motion.div
                  key={shipment.id}
                  variants={itemVariants}
                  className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200"
                >
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                    onClick={() =>
                      toggleShipmentDetails(shipment.id?.toString() || "")
                    }
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-md ${statusInfo.color}`}>
                          {statusInfo.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {shipment.tracking_number}
                          </h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>
                              {shipment.sender_address} to{" "}
                              {shipment.recipient_address}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 flex items-center">
                        <div className="mr-6">
                          <div className="flex items-center">
                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {shipment.created_at
                                ? formatDate(
                                    shipment.created_at.toString()
                                  ).split(",")[0]
                                : "N/A"}
                            </span>
                          </div>
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                            >
                              {statusInfo.label}
                            </span>
                          </div>
                        </div>
                        <div>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Shipment Details
                          </h4>
                          <div className="mt-2 space-y-2">
                            <div>
                              <span className="text-sm font-medium text-gray-500">
                                Weight:
                              </span>
                              <span className="ml-2 text-sm text-gray-900">
                                {shipment.weight} kg
                              </span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">
                                Description:
                              </span>
                              <span className="ml-2 text-sm text-gray-900">
                                {shipment.description}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dates
                          </h4>
                          <div className="mt-2 space-y-2">
                            <div>
                              <span className="text-sm font-medium text-gray-500">
                                Created:
                              </span>
                              <span className="ml-2 text-sm text-gray-900">
                                {shipment.created_at
                                  ? formatDate(shipment.created_at.toString())
                                  : "N/A"}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">
                                Est. Delivery:
                              </span>
                              <span className="ml-2 text-sm text-gray-900">
                                {formatDate(
                                  shipment.estimated_delivery_date.toString()
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex px-6 pb-6 pt-2 justify-end">
                          <ViewShipmentButton shipment={shipment} />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
