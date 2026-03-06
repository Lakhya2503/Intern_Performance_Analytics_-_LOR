import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

// ========================
// Public Pages
// ========================
import NotFound from "./common/NotFound";
import Privacy from "./common/Privacy";
import TermsAndService from "./common/TermsAndService";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Home from "./pages/Home";
import WelcomeScreen from "./pages/WelcomeScreen";

// ========================
// Auth Pages
// ========================
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// ========================
// Layout
// ========================
import Footer from "./common/Footer";
import Navbar from "./common/Navbar";

// ========================
// Mentor Dashboard Pages
// ========================
import Analytics from "./Components/Dashboard/mentor_dash/Analytics";
import ExecutionTeam from "./Components/Dashboard/mentor_dash/ExecutionTeam";
import Interns from "./Components/Dashboard/mentor_dash/Interns";
import InternsLorRequest from "./Components/Dashboard/mentor_dash/InternsLorRequest";
import MentorDashboard from "./Components/Dashboard/mentor_dash/MentorDashboard";
import MentorHomeDashboard from "./Components/Dashboard/mentor_dash/MentorHome";
import MentorProfile from "./Components/Dashboard/mentor_dash/MentorProfile";
import MentorSettings from "./Components/Dashboard/mentor_dash/MentorSettings";
import MentorTask from "./Components/Dashboard/mentor_dash/MentorTask";
import InternCard from "./Components/cards/InternCard";
import MentorNotification from "./Components/Dashboard/mentor_dash/Notification";

// ========================
// Execution Team Dashboard Pages
// ========================
import ExecutionDashboard from "./Components/Dashboard/execution_dash/ExecutionDashboard";
import ExecutionHomeDashboard from "./Components/Dashboard/execution_dash/ExecutionHomeDashboard";
import ExecutionProfile from "./Components/Dashboard/execution_dash/ExecutionProfile";
import ExecutionSetting from "./Components/Dashboard/execution_dash/ExecutionSetting";
import ExecutionTasks from "./Components/Dashboard/execution_dash/ExecutionTasks";
import InternExcution from "./Components/Dashboard/execution_dash/Interns";
import ExecutionNotification from "./Components/Dashboard/execution_dash/ExecutionNotification";
import { AlertTriangle, AlertTriangleIcon, CheckCircle, Info, InfoIcon, XCircle } from "lucide-react";


// =====================================================
// Protected Route Component
// =====================================================
function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}

// =====================================================
// App Content Component
// =====================================================
function AppContent() {
  const location = useLocation();

  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const authRoutes = ["/login", "/register", "/privacy", "/terms","*"];
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Toaster with custom styling */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,

          // Success toast styling
          success: {
            icon: <CheckCircle className="w-5 h-5 text-white-500" />,
            style: {
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              padding: '14px 18px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4), 0 8px 10px -6px rgba(16, 185, 129, 0.3)',
              fontSize: '15px',
              fontWeight: '500',
              letterSpacing: '0.3px',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },

          // Error toast styling
          error: {
            icon: <XCircle className="w-5 h-5 text-rose-500" />,
            style: {
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              padding: '14px 18px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4), 0 8px 10px -6px rgba(239, 68, 68, 0.3)',
              fontSize: '15px',
              fontWeight: '500',
              letterSpacing: '0.3px',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },

          // Info toast styling (new)
          info: {
            icon: <InfoIcon className="w-5 h-5 text-blue-500" />,
            style: {
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#ffffff',
              padding: '14px 18px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 8px 10px -6px rgba(59, 130, 246, 0.3)',
              fontSize: '15px',
              fontWeight: '500',
              letterSpacing: '0.3px',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            },
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#ffffff',
            },
          },

          // Warning toast styling (new)
          warning: {
            icon: <AlertTriangleIcon className="w-5 h-5 text-amber-500" />,
            style: {
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#ffffff',
              padding: '14px 18px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.4), 0 8px 10px -6px rgba(245, 158, 11, 0.3)',
              fontSize: '15px',
              fontWeight: '500',
              letterSpacing: '0.3px',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            },
            iconTheme: {
              primary: '#f59e0b',
              secondary: '#ffffff',
            },
          },

          // Default styling
          style: {
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            maxWidth: '380px',
            animation: 'slideIn 0.3s ease',
            margin: '8px',
          },
        }}

        // Additional container styling
        containerStyle={{
          zIndex: 9999,
        }}

      />


      {/* Navbar only on public pages */}
      {!isDashboardRoute && !isAuthRoute && (
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
      )}

      {/* Main Content Area */}
      <main className={`
        ${!isDashboardRoute && !isAuthRoute ? 'pt-4' : ''}
        transition-all duration-300 ease-in-out
      `}>
        <Routes>
          {/* ========================
              PUBLIC ROUTES
          ======================== */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<TermsAndService />} />

          {/* ========================
              MENTOR DASHBOARD ROUTES
          ======================== */}
          <Route element={<ProtectedRoute allowedRoles={["Mentor"]} />}>
            <Route path="/dashboard/Mentor" element={<MentorDashboard />}>
              <Route index element={<MentorHomeDashboard />} />
              <Route path="home" element={<MentorHomeDashboard />} />
              <Route path="interns" element={<Interns />} />
              <Route path="interns/:internId" element={<InternCard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="notification" element={<MentorNotification />} />
              <Route path="execution-team" element={<ExecutionTeam />} />
              <Route path="lor-requests" element={<InternsLorRequest />} />
              <Route path="task" element={<MentorTask />} />
              <Route path="profile" element={<MentorProfile />} />
              <Route path="setting" element={<MentorSettings />} />
            </Route>
          </Route>

          {/* ========================
              EXECUTION TEAM DASHBOARD ROUTES
          ======================== */}
          <Route element={<ProtectedRoute allowedRoles={["ExecutionTeam"]} />}>
            <Route path="/dashboard/ExecutionTeam" element={<ExecutionDashboard />}>
              <Route index element={<ExecutionHomeDashboard />} />
              <Route path="home" element={<ExecutionHomeDashboard />} />
              <Route path="notification" element={<ExecutionNotification />} />
              <Route path="interns" element={<InternExcution />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="tasks" element={<ExecutionTasks />} />
              <Route path="profile" element={<ExecutionProfile />} />
              <Route path="setting" element={<ExecutionSetting />} />
            </Route>
          </Route>

          {/* ========================
              404 ROUTE
          ======================== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer only on public pages */}
      {!isDashboardRoute && !isAuthRoute && (
        <footer className="mt-auto">
          <Footer />
        </footer>
      )}
    </div>
  );
}

// =====================================================
// Main App Component
// =====================================================
function App() {
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem("seenWelcome"));

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <WelcomeScreen
          onFinish={() => {
            localStorage.setItem("seenWelcome", "true");
            setShowWelcome(false);
          }}
        />
      </div>
    );
  }

  return <AppContent />;
}

export default App;
