import { useState, useEffect, type JSX } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Users,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Types
interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: "pending" | "in_transit" | "delivered" | "cancelled";
  createdAt: string;
  estimatedDelivery: string;
  weight: number;
  description: string;
  userId: string;
  userName: string;
  userEmail: string;
}

interface StatusOption {
  value: "pending" | "in_transit" | "delivered" | "cancelled";
  label: string;
  icon: JSX.Element;
  color: string;
}

const AdminDashboard = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date_desc");
  const [expandedShipment, setExpandedShipment] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    cancelled: 0,
  });

  // Status options for dropdown
  const statusOptions: StatusOption[] = [
    {
      value: "pending",
      label: "Pending",
      icon: <Clock size={16} />,
      color: "text-amber-500 bg-amber-50 border-amber-200",
    },
    {
      value: "in_transit",
      label: "In Transit",
      icon: <Truck size={16} />,
      color: "text-blue-500 bg-blue-50 border-blue-200",
    },
    {
      value: "delivered",
      label: "Delivered",
      icon: <CheckCircle size={16} />,
      color: "text-green-500 bg-green-50 border-green-200",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      icon: <AlertTriangle size={16} />,
      color: "text-red-500 bg-red-50 border-red-200",
    },
  ];

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/shipments");
        if (!response.ok) {
          throw new Error("Failed to fetch shipments");
        }
        const data = await response.json();

        const transformedData: Shipment[] = data.map((shipment: any) => ({
          id: shipment.id.toString(),
          trackingNumber: shipment.tracking_number,
          origin: `${shipment.sender_city}, ${shipment.sender_state}`,
          destination: `${shipment.recipient_city}, ${shipment.recipient_state}`,
          status: shipment.status,
          createdAt: shipment.created_at,
          estimatedDelivery: shipment.estimated_delivery_date,
          weight: shipment.weight,
          description: shipment.description || "No description",
          userId: shipment.user_id.toString(),
          userName: shipment.user_name,
          userEmail: shipment.user_email,
        }));

        setShipments(transformedData);
        setFilteredShipments(transformedData);

        // Calculate stats
        const stats = {
          total: transformedData.length,
          pending: transformedData.filter((s) => s.status === "pending").length,
          inTransit: transformedData.filter((s) => s.status === "in_transit")
            .length,
          delivered: transformedData.filter((s) => s.status === "delivered")
            .length,
          cancelled: transformedData.filter((s) => s.status === "cancelled")
            .length,
        };
        setStats(stats);
      } catch (error) {
        console.error("Error fetching shipments:", error);
        // You might want to show an error toast here
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, []);

  // Filter and sort shipments
  useEffect(() => {
    let result = [...shipments];

    if (statusFilter !== "all") {
      result = result.filter((shipment) => shipment.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (shipment) =>
          shipment.trackingNumber.toLowerCase().includes(term) ||
          shipment.origin.toLowerCase().includes(term) ||
          shipment.destination.toLowerCase().includes(term) ||
          shipment.description.toLowerCase().includes(term) ||
          shipment.userName.toLowerCase().includes(term) ||
          shipment.userEmail.toLowerCase().includes(term)
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "date_asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "date_desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "delivery_asc":
          return (
            new Date(a.estimatedDelivery).getTime() -
            new Date(b.estimatedDelivery).getTime()
          );
        case "delivery_desc":
          return (
            new Date(b.estimatedDelivery).getTime() -
            new Date(a.estimatedDelivery).getTime()
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

  // Get status info
  const getStatusInfo = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option || statusOptions[0];
  };

  // Toggle shipment details
  const toggleShipmentDetails = (id: string) => {
    if (expandedShipment === id) {
      setExpandedShipment(null);
    } else {
      setExpandedShipment(id);
    }
  };

  const handleStatusChange = async (shipmentId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      const response = await fetch(
        `/api/admin/shipments/${shipmentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      setExpandedShipment(null);

      // Update local state
      const updatedShipments = shipments.map((shipment) =>
        shipment.id === shipmentId
          ? { ...shipment, status: newStatus as Shipment["status"] }
          : shipment
      );
      setShipments(updatedShipments);
      setFilteredShipments(updatedShipments);

      // Update stats
      const newStats = {
        total: updatedShipments.length,
        pending: updatedShipments.filter((s) => s.status === "pending").length,
        inTransit: updatedShipments.filter((s) => s.status === "in_transit")
          .length,
        delivered: updatedShipments.filter((s) => s.status === "delivered")
          .length,
        cancelled: updatedShipments.filter((s) => s.status === "cancelled")
          .length,
      };
      setStats(newStats);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(false);
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

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage all shipments and update their status
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="text-sm text-gray-500 mr-2">Welcome, Admin</span>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                A
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-blue-50 text-blue-600">
                <Package size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Shipments
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-amber-50 text-amber-600">
                <Clock size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-blue-50 text-blue-600">
                <Truck size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Transit</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.inTransit}
                </h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-green-50 text-green-600">
                <CheckCircle size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Delivered</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.delivered}
                </h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-red-50 text-red-600">
                <AlertTriangle size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Cancelled</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.cancelled}
                </h3>
              </div>
            </div>
          </motion.div>
        </div>

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
                placeholder="Search by tracking number, customer, or location"
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
              Try adjusting your search or filter criteria
            </p>
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
              const isExpanded = expandedShipment === shipment.id;

              return (
                <motion.div
                  key={shipment.id}
                  variants={itemVariants}
                  className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200"
                >
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                    onClick={() => toggleShipmentDetails(shipment.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-md ${statusInfo.color}`}>
                          {statusInfo.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {shipment.trackingNumber}
                          </h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>
                              {shipment.origin} to {shipment.destination}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>
                              {shipment.userName} ({shipment.userEmail})
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 flex items-center">
                        <div className="mr-6">
                          <div className="flex items-center">
                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {formatDate(shipment.createdAt).split(",")[0]}
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
                                {formatDate(shipment.createdAt)}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">
                                Est. Delivery:
                              </span>
                              <span className="ml-2 text-sm text-gray-900">
                                {formatDate(shipment.estimatedDelivery)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex px-6 pb-6 pt-2 justify-end">
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status Management
                            </h4>
                            <div className="mt-2">
                              <div className="flex flex-col space-y-3">
                                <div className="flex flex-wrap gap-2">
                                  <Select
                                    defaultValue={shipment.status}
                                    onValueChange={(value) =>
                                      handleStatusChange(shipment.id, value)
                                    }
                                    disabled={updatingStatus}
                                  >
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {statusOptions.map((option) => (
                                        <SelectItem
                                          key={option.value}
                                          value={option.value}
                                          className="flex items-center gap-2"
                                        >
                                          {option.icon}
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </div>
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

export default AdminDashboard;
