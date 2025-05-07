import { useState } from "react";
import { Truck, Weight, MapPin, Clock, Zap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ShippingCalculator = () => {
  const [weight, setWeight] = useState<number>(0);
  const [shippingMethod, setShippingMethod] = useState<string>("standard");
  const [destination, setDestination] = useState<string>("");
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>("");

  const calculateShipping = () => {
    // Base shipping calculation logic
    const baseRate = 10;
    const parsedWeight = parseFloat(weight.toString()) || 0;

    let methodMultiplier = 1;
    switch (shippingMethod) {
      case "express":
        methodMultiplier = 2;
        break;
      case "priority":
        methodMultiplier = 1.5;
        break;
      default:
        methodMultiplier = 1;
    }

    const cost = baseRate + parsedWeight * 2 * methodMultiplier;
    setEstimatedCost(parseFloat(cost.toFixed(2)));

    // Calculate estimated delivery
    const today = new Date();
    let deliveryDays = 0;

    switch (shippingMethod) {
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
    setEstimatedDelivery(deliveryDate.toDateString());
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Calculate Shipping Cost
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Package Weight (kg)
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Weight className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter weight"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter destination"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ">
            Shipping Method
          </label>
          <Select value={shippingMethod} onValueChange={setShippingMethod}>
            <SelectTrigger className="w-full h-10" size="sm">
              <SelectValue placeholder="Select shipping method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Standard (5-7 days)
                </div>
              </SelectItem>
              <SelectItem value="priority">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Priority (2-3 days)
                </div>
              </SelectItem>
              <SelectItem value="express">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Express (1 day)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button
          onClick={calculateShipping}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          Calculate Shipping
        </button>

        {estimatedCost && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-800 mb-2">
              Shipping Estimate
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Estimated Cost:</p>
                <p className="text-xl font-bold text-blue-700">
                  ${estimatedCost}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery:</p>
                <p className="text-md font-medium text-blue-700">
                  {estimatedDelivery}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Final cost may vary based on actual weight and destination
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingCalculator;
