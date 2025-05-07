import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

// Pages
import Login from "./pages/auth/Login";
import LandingPage from "./pages/LandingPage";

// Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import { AuthProvider } from "./components/context/AuthContext.tsx";
import Register from "./pages/auth/Register.tsx";
import Dashboard from "./components/client/Dashboard .tsx";
import AdminDashboard from "./components/admin/AdminDashboard.tsx";
import CreateShipment from "./components/client/CreateShipment.tsx";
import DashboardRedirect from "./components/common/DashboardRedirect.tsx";

// Auth state types
type User = {
  id: number;
  name: string;
  email: string;
  role: "client" | "admin";
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  if (loading || (user === null && localStorage.getItem("user"))) {
    // Wait until user is fully initialized from localStorage
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/login"
                element={user ? <Navigate to="/dashboard" /> : <Login />}
              />
              <Route
                path="/register"
                element={user ? <Navigate to="/dashboard" /> : <Register />}
              />
              {/* Protected Routes */}

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRedirect />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-shipment"
                element={
                  <ProtectedRoute>
                    <CreateShipment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
