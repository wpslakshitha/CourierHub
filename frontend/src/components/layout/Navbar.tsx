import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Package, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">
                CourierHub
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="end">
                  <div className="flex flex-col space-y-1">
                    <Link
                      to="/dashboard"
                      className="w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        logout();
                        window.location.href = "/";
                      }}
                      className="w-full justify-start px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
