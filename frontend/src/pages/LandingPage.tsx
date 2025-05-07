import {
  Truck,
  Package,
  Globe,
  Shield,
  Clock,
  CheckCircle,
  HeadphonesIcon,
  MapPin,
  ArrowRight,
  Search,
  Headphones,
  Calendar,
  Zap,
  CreditCard,
  Calculator,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "../components/ui/button";
import type { Shipment } from "@/types/types";
import { toast } from "sonner";
import ShippingCalculator from "../components/client/ShippingCalculator";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../components/context/AuthContext";

const LandingPage = () => {
  const { user } = useAuth();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<Shipment | null>(null);

  const handleTrackShipment = async () => {
    if (!trackingNumber.trim()) {
      toast("Error", {
        description: "Please enter a tracking number",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/shipments/track/${trackingNumber}`);
      if (!response.ok) {
        throw new Error("Shipment not found");
      }
      const data = await response.json();
      setTrackingInfo(data);
    } catch (error) {
      toast("Error", {
        description: "Invalid tracking number or shipment not found",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-blue-900 dark:to-indigo-950 opacity-10"></div>
          <div className="absolute inset-0 bg-[url('/assets/mesh-pattern.svg')] bg-repeat opacity-5"></div>
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white to-transparent dark:from-gray-900 dark:to-transparent"></div>

          {/* Animated Background Elements */}
          <div
            className="absolute top-20 right-20 w-64 h-64 rounded-full bg-blue-600 opacity-10 blur-3xl"
            style={{
              animation: "pulse-slow 8s ease-in-out infinite alternate",
            }}
          ></div>
          <div
            className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-indigo-600 opacity-10 blur-3xl"
            style={{
              animation: "pulse-slow 8s ease-in-out 2s infinite alternate",
            }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-purple-600 opacity-10 blur-3xl"
            style={{
              animation: "pulse-slow 8s ease-in-out 4s infinite alternate",
            }}
          ></div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Content - Text Section */}
            <div className="lg:col-span-6 space-y-8">
              {/* Badge Pill with Animation */}
              <div
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-full border border-blue-100 dark:border-blue-800 shadow-sm"
                style={{
                  animation: "fadeInUp 0.8s ease-out forwards",
                  opacity: 0,
                  transform: "translateY(20px)",
                }}
              >
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="ml-3 text-sm font-medium text-blue-800 dark:text-blue-200">
                  Premium Logistics Partner
                </span>
              </div>

              {/* Main Heading with Enhanced Typography and Animation */}
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                style={{
                  animation: "fadeInUp 0.8s ease-out 0.2s forwards",
                  opacity: 0,
                  transform: "translateY(20px)",
                }}
              >
                <span className="block">Transform Your</span>
                <span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400"
                  style={{
                    backgroundSize: "200% 100%",
                    animation: "gradientShift 8s ease infinite",
                  }}
                >
                  Global Shipping
                </span>
                <span className="block">Experience</span>
              </h1>

              {/* Subheading with Improved Typography and Animation */}
              <p
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl"
                style={{
                  animation: "fadeInUp 0.8s ease-out 0.4s forwards",
                  opacity: 0,
                  transform: "translateY(20px)",
                }}
              >
                Elevate your logistics operations with our AI-powered tracking
                and worldwide delivery network. The most reliable partner for
                your global shipping solutions.
              </p>

              {/* Enhanced CTA Buttons with Animation */}
              <div
                className="flex flex-wrap gap-4 pt-4"
                style={{
                  animation: "fadeInUp 0.8s ease-out 0.6s forwards",
                  opacity: 0,
                  transform: "translateY(20px)",
                }}
              >
                {user ? (
                  <Link
                    to="/dashboard"
                    className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-1 hover:scale-105"
                    style={{
                      backgroundSize: "200% 100%",
                      animation: "gradientShift 3s ease infinite",
                    }}
                  >
                    View Shipments
                    <ArrowRight
                      className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                      strokeWidth={2}
                    />
                  </Link>
                ) : (
                  <a
                    href="#get-started"
                    className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-1 hover:scale-105"
                    style={{
                      backgroundSize: "200% 100%",
                      animation: "gradientShift 3s ease infinite",
                    }}
                  >
                    Get Started
                    <ArrowRight
                      className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                      strokeWidth={2}
                    />
                  </a>
                )}
                <a
                  href="#learn-more"
                  className="group inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1 hover:scale-105"
                  style={{
                    animation: "borderPulse 2s ease-in-out infinite alternate",
                  }}
                >
                  Learn More
                  <ArrowRight
                    className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                    strokeWidth={2}
                  />
                </a>
              </div>

              {/* Stats Section with Animation */}
              <div
                className="grid grid-cols-3 gap-4 pt-8 max-w-xl"
                style={{
                  animation: "fadeInUp 0.8s ease-out 0.8s forwards",
                  opacity: 0,
                  transform: "translateY(20px)",
                }}
              >
                <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div
                    className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                    style={{ animation: "countUp 2s ease-out 1s forwards" }}
                  >
                    200+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Countries
                  </div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div
                    className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
                    style={{ animation: "countUp 2s ease-out 1.2s forwards" }}
                  >
                    24/7
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Support
                  </div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div
                    className="text-2xl font-bold text-violet-600 dark:text-violet-400"
                    style={{ animation: "countUp 2s ease-out 1.4s forwards" }}
                  >
                    99.8%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    On-time
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Visual Section with Animation */}
            <div
              className="lg:col-span-6 relative"
              style={{
                animation: "fadeInRight 1s ease-out 0.4s forwards",
                opacity: 0,
                transform: "translateX(20px)",
              }}
            >
              {/* Enhanced Image Presentation */}
              <div
                className="relative"
                style={{ animation: "float 6s ease-in-out infinite" }}
              >
                {/* Glowing Effect */}
                <div
                  className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-20 blur-3xl rounded-3xl"
                  style={{
                    animation: "pulse-slow 4s ease-in-out infinite alternate",
                  }}
                ></div>

                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 dark:border-gray-800/50">
                  <img
                    src="/src/assets/delivery-illustration.png"
                    alt="Advanced Delivery Services"
                    className="w-full object-cover"
                    style={{ animation: "zoom 1s ease-out" }}
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-transparent"></div>
                </div>
              </div>

              {/* Floating Feature Cards with Animation */}
              <div
                className="absolute -right-4 top-1/4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-transform duration-300"
                style={{
                  animation:
                    "slideInRight 0.8s ease-out 0.8s forwards, float 4s ease-in-out infinite",
                  opacity: 0,
                  transform: "translateX(20px)",
                }}
              >
                <div className="flex items-center">
                  <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span className="ml-2 text-sm font-medium">
                    Fast Delivery
                  </span>
                </div>
              </div>

              <div
                className="absolute -left-4 top-2/3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-transform duration-300"
                style={{
                  animation:
                    "slideInLeft 0.8s ease-out 1s forwards, float 4s ease-in-out 1s infinite",
                  opacity: 0,
                  transform: "translateX(-20px)",
                }}
              >
                <div className="flex items-center">
                  <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <span className="ml-2 text-sm font-medium">
                    Secure Packaging
                  </span>
                </div>
              </div>

              <div
                className="absolute left-1/4 bottom-0 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-transform duration-300"
                style={{
                  animation:
                    "slideInUp 0.8s ease-out 1.2s forwards, float 4s ease-in-out 2s infinite",
                  opacity: 0,
                  transform: "translateY(20px)",
                }}
              >
                <div className="flex items-center">
                  <Globe className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  <span className="ml-2 text-sm font-medium">
                    Global Network
                  </span>
                </div>
              </div>

              {/* Animated Dot Pattern */}
              <div
                className="absolute -z-10 right-0 bottom-0 w-32 h-32 opacity-20"
                style={{ animation: "rotateAnimation 20s linear infinite" }}
              >
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(16)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"
                      style={{
                        animation: `pulse-slow ${
                          1 + (i % 4) * 0.5
                        }s ease-in-out ${i * 0.1}s infinite alternate`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator with Animation */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          style={{
            animation: "fadeIn 1s ease-out 1.5s forwards",
            opacity: 0,
          }}
        >
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Scroll Down
          </span>
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>
      {/* Track Shipment Section */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center justify-center mb-12 text-center">
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 border border-blue-200 rounded-full mb-4">
              <Zap className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">
                Real-time Tracking
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Track Your Shipment Instantly
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl">
              Enter your tracking number to get real-time updates on your
              package's location
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 md:p-8 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-blue-200" />
                  </div>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter your tracking number"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                  />
                </div>
                <Button
                  onClick={handleTrackShipment}
                  disabled={isLoading}
                  className="h-14 md:w-auto py-4 px-8 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
                      <span>Tracking...</span>
                    </>
                  ) : (
                    <>
                      <span>Track Package</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-8 mt-6 pt-4 border-t border-white/10 text-white text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Real-time updates</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Precise location</span>
                </div>
                <div className="hidden md:flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Delivery estimates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracking Result Section */}
      {trackingInfo && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Shipment Status
                    </h3>
                    <p className="text-gray-500">
                      Tracking ID:{" "}
                      <span className="font-medium">
                        {trackingInfo.tracking_number}
                      </span>
                    </p>
                  </div>
                  <div
                    className={`px-6 py-2 rounded-full text-sm font-medium ${
                      trackingInfo.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : trackingInfo.status === "in_transit"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {trackingInfo.status === "delivered"
                      ? "Delivered"
                      : trackingInfo.status === "in_transit"
                      ? "In Transit"
                      : "Pending"}
                  </div>
                </div>

                {/* Status timeline */}
                <div className="mb-8 overflow-hidden">
                  <div className="relative flex items-center justify-between mb-8">
                    {/* Progress line */}
                    <div className="absolute left-0 top-4.5 transform -translate-y-1/2 h-1 bg-gray-200 w-full z-0"></div>
                    <div
                      className={`absolute left-0 top-4.5 transform -translate-y-1/2 h-1 bg-blue-600 z-10 transition-all duration-700 ease-out ${
                        trackingInfo.status === "pending"
                          ? "w-0"
                          : trackingInfo.status === "in_transit"
                          ? "w-1/2"
                          : "w-full"
                      }`}
                    ></div>

                    {/* Status points */}
                    <div className="relative z-20 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          trackingInfo.status === "pending" ||
                          trackingInfo.status === "in_transit" ||
                          trackingInfo.status === "delivered"
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-700">
                        Pending
                      </span>
                    </div>

                    <div className="relative z-20 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          trackingInfo.status === "in_transit" ||
                          trackingInfo.status === "delivered"
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <Truck className="w-5 h-5 text-white" />
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-700">
                        In Transit
                      </span>
                    </div>

                    <div className="relative z-20 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          trackingInfo.status === "delivered"
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-700">
                        Delivered
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Delivery Details */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      Delivery Details
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Estimated Delivery
                        </p>
                        <p className="font-medium text-gray-900">
                          {new Date(
                            trackingInfo.estimated_delivery_date
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Package Type</p>
                        <p className="font-medium text-gray-900">
                          {trackingInfo.package_type}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Weight</p>
                        <p className="font-medium text-gray-900">
                          {trackingInfo.weight} kg
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Route */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      Shipping Route
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">From</p>
                        <p className="font-medium text-gray-900">
                          {trackingInfo.sender_address}
                        </p>
                        <p className="text-sm text-gray-500">
                          {trackingInfo.sender_city},{" "}
                          {trackingInfo.sender_country}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">To</p>
                        <p className="font-medium text-gray-900">
                          {trackingInfo.recipient_address}
                        </p>
                        <p className="text-sm text-gray-500">
                          {trackingInfo.recipient_city},{" "}
                          {trackingInfo.recipient_country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Help button */}
                <div className="mt-8 text-center">
                  <Link
                    to="/support"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Headphones className="w-4 h-4 mr-2" />
                    Need help with this shipment?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Premium Delivery Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored solutions to meet your shipping needs with unmatched
              reliability and precision
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Truck className="w-8 h-8" />,
                title: "Express Delivery",
                description:
                  "Priority shipping with guaranteed 24-48 hour delivery to any destination.",
              },
              {
                icon: <Package className="w-8 h-8" />,
                title: "Package Protection",
                description:
                  "Comprehensive insurance and careful handling for all your valuable items.",
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Shipping",
                description:
                  "Worldwide delivery network covering 200+ countries with customs expertise.",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure Delivery",
                description:
                  "End-to-end tracking and secure verification systems for peace of mind.",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-blue-600 mb-6 flex justify-center">
                  <div className="p-4 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Calculator Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-3 bg-blue-100 px-4 py-1 rounded-full">
              <span className="text-blue-700 font-medium flex items-center justify-center gap-2">
                <Truck className="w-4 h-4" /> Fast & Reliable Shipping
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-800 tracking-tight">
              Instant Shipping <span className="text-blue-600">Estimates</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Get accurate shipping costs and delivery times calculated in
              real-time
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* How It Works Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-5 bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-blue-100"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">
                  How Our Calculator Works
                </h3>
              </div>

              <div className="space-y-8">
                {[
                  {
                    icon: <MapPin className="w-5 h-5 text-white" />,
                    bgColor: "bg-blue-600",
                    title: "Enter Destination",
                    description:
                      "Provide your destination to get region-specific pricing and delivery options.",
                  },
                  {
                    icon: <Package className="w-5 h-5 text-white" />,
                    bgColor: "bg-indigo-600",
                    title: "Specify Package Details",
                    description:
                      "Input weight and dimensions for the most accurate shipping quote.",
                  },
                  {
                    icon: <Clock className="w-5 h-5 text-white" />,
                    bgColor: "bg-violet-600",
                    title: "Select Shipping Speed",
                    description:
                      "Choose from express, standard, or economy options to match your needs.",
                  },
                  {
                    icon: <CreditCard className="w-5 h-5 text-white" />,
                    bgColor: "bg-emerald-600",
                    title: "Get Instant Quote",
                    description:
                      "Receive detailed pricing with tax breakdown and guaranteed delivery date.",
                  },
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`p-2 ${step.bgColor} rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300`}
                      >
                        {step.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800 mb-2">
                        {step.title}
                      </h4>
                      <p className="text-slate-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">
                    Secure and transparent pricing
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Calculator Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full -mr-20 -mt-20 z-0"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-50 rounded-full -ml-10 -mb-10 z-0"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-slate-800">
                      Shipping Calculator
                    </h3>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 px-3"
                    >
                      <Globe className="w-4 h-4 mr-1" /> Global Shipping
                    </Badge>
                  </div>

                  <ShippingCalculator />

                  <div className="mt-6 flex flex-wrap gap-4 justify-center">
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-slate-700">
                        Free over $100
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-slate-700">
                        2-5 business days
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                      <MapPin className="w-4 h-4 text-violet-600" />
                      <span className="text-sm text-slate-700">
                        200+ countries
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors duration-300 cursor-pointer group">
              <span className="font-medium">
                Learn more about our shipping policies
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section
        className="py-16 bg-blue-700 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "99.8%", label: "On-time Delivery" },
              { number: "15,000+", label: "Daily Shipments" },
              { number: "200+", label: "Countries Served" },
              { number: "24/7", label: "Customer Support" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <h3 className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </h3>
                <p className="text-blue-100 text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Why Choose Our Service
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Industry-leading logistics expertise with a customer-first
              approach
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Reliability",
                description:
                  "With a 99.8% on-time delivery rate, we pride ourselves on being the most reliable courier service in the industry.",
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Transparency",
                description:
                  "Real-time tracking and proactive notifications keep you informed at every step of the delivery process.",
              },
              {
                icon: <HeadphonesIcon className="w-6 h-6" />,
                title: "Customer Support",
                description:
                  "Our dedicated support team is available 24/7 to assist you with any questions or concerns about your shipments.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <motion.section
        className="py-16 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                  Global Network, Local Expertise
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Our extensive global network allows us to deliver packages
                  efficiently across continents while maintaining local
                  expertise in each region we serve.
                </p>
                <div className="flex items-center mb-4">
                  <MapPin className="text-blue-600 mr-3" />
                  <span className="text-gray-700">
                    200+ countries and territories served
                  </span>
                </div>
                <div className="flex items-center mb-4">
                  <MapPin className="text-blue-600 mr-3" />
                  <span className="text-gray-700">
                    5,000+ delivery centers worldwide
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-blue-600 mr-3" />
                  <span className="text-gray-700">
                    Local customs expertise in every region
                  </span>
                </div>
              </motion.div>
            </div>
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="/src/assets/world-map.png"
                alt="Global Delivery Network"
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-blue-700 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-10"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="container mx-auto px-6 relative z-10 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Shipping Experience?
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-blue-100">
            Join thousands of businesses and individuals who trust us with their
            most important deliveries.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link
              to="/register"
              className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                Get Started <ArrowRight size={18} />
              </span>
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-700 px-8 py-4 rounded-lg font-semibold transition-all duration-300"
            >
              Contact Sales
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
