import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Home,
  Package,
  Truck,
  Weight,
  Info,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  FileText,
  Clock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface FormData {
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
  created_at?: Date; // Optional for new records (auto-generated)
  updated_at?: Date; // Optional for new records (auto-generated)
}

interface FormErrors {
  [key: string]: string;
}

const CreateShipment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [estimatedDelivery, setEstimatedDelivery] = useState<Date>();
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  const [formData, setFormData] = useState<FormData>({
    tracking_number: "",
    shipping_cost: estimatedCost || 0,
    status: "pending",
    // Sender information (from user profile)
    user_id: user?.user_id || 0,
    sender_name: user?.name || "",
    sender_email: user?.email || "",
    sender_phone: user?.phone || "",
    sender_address: "",
    sender_city: "",
    sender_state: "",
    sender_zip: "",
    sender_country: "Sri Lanka",

    // Recipient details
    recipient_name: "",
    recipient_email: "",
    recipient_phone: "",
    recipient_address: "",
    recipient_city: "",
    recipient_state: "",
    recipient_zip: "",
    recipient_country: "Sri Lanka",

    // Shipment details
    package_type: "box",
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    description: "",
    declared_value: 0,
    delivery_notes: "",
    estimated_delivery_date: estimatedDelivery || new Date(),

    // Shipping options
    shipping_method: "standard",
    insurance: false,
    signature_required: false,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  // Sender information (from user profile)
  const [senderInfo, setSenderInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.email) return;

      try {
        setSenderInfo({
          name: user.name,
          email: user.email,
          phone: user.phone,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load profile information");
      }
    };

    fetchUserProfile();
  }, [user]);

  // Calculate shipping estimate when relevant fields change
  useEffect(() => {
    if (
      formData.recipient_zip &&
      formData.weight &&
      formData.package_type &&
      formData.shipping_method
    ) {
      calculateShippingEstimate();
    } else {
      setEstimatedCost(null);
      setEstimatedDelivery(undefined);
    }
  }, [
    formData.recipient_zip,
    formData.weight,
    formData.package_type,
    formData.shipping_method,
  ]);

  const calculateShippingEstimate = () => {
    // This would be replaced with an actual API call to calculate shipping
    // For demonstration, we'll use mock data

    const baseRate = 10;
    const weight = parseFloat(formData.weight.toString()) || 0;

    let methodMultiplier = 1;
    switch (formData.shipping_method) {
      case "express":
        methodMultiplier = 2;
        break;
      case "priority":
        methodMultiplier = 1.5;
        break;
      default:
        methodMultiplier = 1;
    }

    const cost = baseRate + weight * 2 * methodMultiplier;
    setEstimatedCost(parseFloat(cost.toFixed(2)));

    // Calculate estimated delivery date
    const today = new Date();
    let deliveryDays = 0;

    switch (formData.shipping_method) {
      case "express":
        deliveryDays = 1;
        break;
      case "priority":
        deliveryDays = 3;
        break;
      default:
        deliveryDays = 5;
    }

    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);

    setEstimatedDelivery(deliveryDate);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: FormErrors = {};

    // Validate based on current step
    if (step === 1) {
      if (!formData.recipient_name.trim()) {
        errors.recipient_name = "Recipient name is required";
      }

      if (!formData.recipient_address.trim()) {
        errors.recipient_address = "Recipient address is required";
      }

      if (!formData.recipient_city.trim()) {
        errors.recipient_city = "City is required";
      }

      if (!formData.recipient_state.trim()) {
        errors.recipient_state = "State/Province is required";
      }

      if (!formData.recipient_zip.trim()) {
        errors.recipient_zip = "ZIP/Postal code is required";
      }
    } else if (step === 2) {
      if (!formData.weight) {
        errors.weight = "Weight is required";
      } else if (
        isNaN(Number(formData.weight)) ||
        parseFloat(formData.weight.toString()) <= 0
      ) {
        errors.weight = "Please enter a valid weight";
      }

      if (!formData.description?.trim()) {
        errors.description = "Package description is required";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await fetch("/api/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          user_id: user?.user_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create shipment");
      }
      setSuccess("Shipment created successfully");
      const data = await response.json();
      navigate(`/tracking/${data.tracking_number}`);
    } catch (error) {
      console.error("Error creating shipment:", error);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Render form steps
  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Recipient Information
            </h2>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="recipient_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Recipient Name*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="recipient_name"
                    name="recipient_name"
                    value={formData.recipient_name}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      formErrors.recipient_name
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    placeholder="Full Name"
                  />
                </div>
                {formErrors.recipient_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.recipient_name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="recipient_email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="recipient_email"
                      name="recipient_email"
                      value={formData.recipient_email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="recipient_phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="recipient_phone"
                      name="recipient_phone"
                      value={formData.recipient_phone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="recipient_address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Street Address*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="recipient_address"
                    name="recipient_address"
                    value={formData.recipient_address}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      formErrors.recipient_address
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    placeholder="123 Main St, Apt 4B"
                  />
                </div>
                {formErrors.recipient_address && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.recipient_address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="recipient_city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City*
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="recipient_city"
                      name="recipient_city"
                      value={formData.recipient_city}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        formErrors.recipient_city
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      placeholder="New York"
                    />
                  </div>
                  {formErrors.recipient_city && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.recipient_city}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="recipient_state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State/Province*
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      id="recipient_state"
                      name="recipient_state"
                      value={formData.recipient_state}
                      onChange={handleChange}
                      className={`block w-full px-3 py-3 border ${
                        formErrors.recipient_state
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      placeholder="NY"
                    />
                  </div>
                  {formErrors.recipient_state && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.recipient_state}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="recipient_zip"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ZIP/Postal Code*
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      id="recipient_zip"
                      name="recipient_zip"
                      value={formData.recipient_zip}
                      onChange={handleChange}
                      className={`block w-full px-3 py-3 border ${
                        formErrors.recipient_zip
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      placeholder="10001"
                    />
                  </div>
                  {formErrors.recipient_zip && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.recipient_zip}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="recipient_country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <select
                    id="recipient_country"
                    name="recipient_country"
                    value={formData.recipient_country}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Mexico">Mexico</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Package Details
            </h2>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="package_type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Package Type*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="package_type"
                    name="package_type"
                    value={formData.package_type}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <option value="box">Box</option>
                    <option value="envelope">Envelope</option>
                    <option value="tube">Tube</option>
                    <option value="pallet">Pallet</option>
                    <option value="custom">Custom Package</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-gray-700"
                >
                  Weight (kg)*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Weight className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    min="0.1"
                    step="0.1"
                    value={formData.weight}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      formErrors.weight ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    placeholder="5.0"
                  />
                </div>
                {formErrors.weight && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.weight}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions (cm)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="length"
                      className="block text-xs text-gray-500"
                    >
                      Length
                    </label>
                    <input
                      type="number"
                      id="length"
                      name="length"
                      min="1"
                      step="0.1"
                      value={formData.length}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="width"
                      className="block text-xs text-gray-500"
                    >
                      Width
                    </label>
                    <input
                      type="number"
                      id="width"
                      name="width"
                      min="1"
                      step="0.1"
                      value={formData.width}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="height"
                      className="block text-xs text-gray-500"
                    >
                      Height
                    </label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      min="1"
                      step="0.1"
                      value={formData.height}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      placeholder="15"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Package Description*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      formErrors.description
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    placeholder="Describe the contents of your package"
                  />
                </div>
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="declared_value"
                  className="block text-sm font-medium text-gray-700"
                >
                  Declared Value ($)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="declared_value"
                    name="declared_value"
                    min="0"
                    step="0.01"
                    value={formData.declared_value}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="100.00"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  For insurance purposes. Leave blank if not applicable.
                </p>
              </div>

              <div>
                <label
                  htmlFor="delivery_notes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Delivery Notes
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <textarea
                    id="delivery_notes"
                    name="delivery_notes"
                    rows={2}
                    value={formData.delivery_notes}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Special delivery instructions (optional)"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Shipping Options
            </h2>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="shipping_method"
                  className="block text-sm font-medium text-gray-700"
                >
                  Shipping Method*
                </label>
                <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      formData.shipping_method === "standard"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        shippingMethod: "standard",
                      }))
                    }
                  >
                    <div className="flex items-center mb-2">
                      <Truck className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">Standard</span>
                    </div>
                    <p className="text-sm text-gray-600">5-7 business days</p>
                    <p className="text-sm font-medium text-blue-600 mt-2">
                      Most economical
                    </p>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      formData.shipping_method === "priority"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        shippingMethod: "priority",
                      }))
                    }
                  >
                    <div className="flex items-center mb-2">
                      <Truck className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">Priority</span>
                    </div>
                    <p className="text-sm text-gray-600">2-3 business days</p>
                    <p className="text-sm font-medium text-blue-600 mt-2">
                      Balanced option
                    </p>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      formData.shipping_method === "express"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        shippingMethod: "express",
                      }))
                    }
                  >
                    <div className="flex items-center mb-2">
                      <Truck className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">Express</span>
                    </div>
                    <p className="text-sm text-gray-600">Next business day</p>
                    <p className="text-sm font-medium text-blue-600 mt-2">
                      Fastest delivery
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="insurance"
                    name="insurance"
                    checked={formData.insurance}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="insurance"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Add Shipping Insurance
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="signature_required"
                    name="signature_required"
                    checked={formData.signature_required}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="signature_required"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Require Signature on Delivery
                  </label>
                </div>
              </div>

              {estimatedCost !== null && estimatedDelivery !== null && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-md font-medium text-blue-800 mb-2">
                    Shipping Estimate
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Estimated Cost:</p>
                      <p className="text-lg font-bold text-blue-700">
                        ${estimatedCost}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Estimated Delivery:
                      </p>
                      <p className="text-md font-medium text-blue-700">
                        {estimatedDelivery?.toString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * Final cost may vary based on actual weight and dimensions
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Review & Confirm
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-800 mb-3">
                  Sender Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name:</p>
                    <p className="text-md font-medium">{senderInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact:</p>
                    <p className="text-md">{senderInfo.email}</p>
                    <p className="text-md">{senderInfo.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Address:</p>
                    {/* <p className="text-md">
                      {senderInfo.address}, {senderInfo.city},{" "}
                      {senderInfo.state} {senderInfo.zip}
                    </p>
                    <p className="text-md">{senderInfo.country}</p> */}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-800 mb-3">
                  Recipient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name:</p>
                    <p className="text-md font-medium">
                      {formData.recipient_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact:</p>
                    {formData.recipient_email && (
                      <p className="text-md">{formData.recipient_email}</p>
                    )}
                    {formData.recipient_phone && (
                      <p className="text-md">{formData.recipient_phone}</p>
                    )}
                    {!formData.recipient_email && !formData.recipient_phone && (
                      <p className="text-md text-gray-500">
                        No contact information provided
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Address:</p>
                    <p className="text-md">
                      {formData.recipient_address}, {formData.recipient_city},{" "}
                      {formData.recipient_state} {formData.recipient_zip}
                    </p>
                    <p className="text-md">{formData.recipient_country}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-800 mb-3">
                  Package Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Package Type:</p>
                    <p className="text-md font-medium capitalize">
                      {formData.package_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Weight:</p>
                    <p className="text-md">{formData.weight} kg</p>
                  </div>

                  {(formData.length || formData.width || formData.height) && (
                    <div>
                      <p className="text-sm text-gray-600">Dimensions (cm):</p>
                      <p className="text-md">
                        {formData.length || "0"} × {formData.width || "0"} ×{" "}
                        {formData.height || "0"}
                      </p>
                    </div>
                  )}

                  {formData.declared_value && (
                    <div>
                      <p className="text-sm text-gray-600">Declared Value:</p>
                      <p className="text-md">${formData.declared_value}</p>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Description:</p>
                    <p className="text-md">{formData.description}</p>
                  </div>

                  {formData.delivery_notes && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Delivery Notes:</p>
                      <p className="text-md">{formData.delivery_notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-800 mb-3">
                  Shipping Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Shipping Method:</p>
                    <p className="text-md font-medium capitalize">
                      {formData.shipping_method}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Additional Services:
                    </p>
                    {formData.insurance || formData.signature_required ? (
                      <ul className="list-disc list-inside text-md">
                        {formData.insurance && <li>Shipping Insurance</li>}
                        {formData.signature_required && (
                          <li>Signature Required</li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-md text-gray-500">None</p>
                    )}
                  </div>
                </div>
              </div>

              {estimatedCost !== null && estimatedDelivery !== null && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-md font-medium text-blue-800 mb-2">
                    Shipping Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Estimated Cost:</p>
                      <p className="text-lg font-bold text-blue-700">
                        ${estimatedCost}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Estimated Delivery:
                      </p>
                      <p className="text-md font-medium text-blue-700">
                        {estimatedDelivery?.toString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <Info className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-700">
                    By clicking "Create Shipment", you agree to our terms and
                    conditions for shipping services.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-xl font-bold text-white">
              Create New Shipment
            </h1>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full ${
                    step >= 1 ? "bg-blue-600" : "bg-gray-300"
                  } text-white`}
                >
                  <User size={16} />
                </div>
                <div
                  className={`ml-2 text-sm font-medium ${
                    step >= 1 ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  Recipient
                </div>
              </div>

              <div
                className={`flex-grow border-t mx-4 ${
                  step >= 2 ? "border-blue-600" : "border-gray-300"
                }`}
              />

              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full ${
                    step >= 2 ? "bg-blue-600" : "bg-gray-300"
                  } text-white`}
                >
                  <Package size={16} />
                </div>
                <div
                  className={`ml-2 text-sm font-medium ${
                    step >= 2 ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  Package
                </div>
              </div>

              <div
                className={`flex-grow border-t mx-4 ${
                  step >= 3 ? "border-blue-600" : "border-gray-300"
                }`}
              />

              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full ${
                    step >= 3 ? "bg-blue-600" : "bg-gray-300"
                  } text-white`}
                >
                  <Truck size={16} />
                </div>
                <div
                  className={`ml-2 text-sm font-medium ${
                    step >= 3 ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  Shipping
                </div>
              </div>

              <div
                className={`flex-grow border-t mx-4 ${
                  step >= 4 ? "border-blue-600" : "border-gray-300"
                }`}
              />

              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full ${
                    step >= 4 ? "bg-blue-600" : "bg-gray-300"
                  } text-white`}
                >
                  <CheckCircle size={16} />
                </div>
                <div
                  className={`ml-2 text-sm font-medium ${
                    step >= 4 ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  Review
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6">
              {/* Success/Error Messages */}
              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{success}</p>
                    <p className="text-sm mt-1">Redirecting to dashboard...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {/* Form Steps */}
              {renderFormStep()}
            </div>

            {/* Form Actions */}
            <div className="px-6 py-4 bg-gray-50 flex justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || success !== ""}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    (isLoading || success !== "") &&
                    "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Clock className="animate-spin mr-2 h-4 w-4" />
                      Processing...
                    </>
                  ) : (
                    "Create Shipment"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateShipment;
