import { Package, Mail, Phone, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-white">CourierHub</span>
            </div>
            <p className="text-sm">
              Your reliable partner for fast and secure deliveries across the
              globe.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Track Package
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary">
                  Express Delivery
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  International Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Fragile Items
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Business Solutions
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>123 Shipping Lane, Logistics City</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@courierhub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} CourierHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
