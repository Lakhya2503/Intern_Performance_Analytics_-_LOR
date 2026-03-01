import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

// ========================
// Public Pages
// ========================
import NotFound from "./common/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";

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
import ExecutionTeam from './Components/Dashboard/mentor_dash/ExecutionTeam';
import Interns from "./Components/Dashboard/mentor_dash/Interns";
import InternsLorRequest from "./Components/Dashboard/mentor_dash/InternsLorRequest";
import MentorDashboard from "./Components/Dashboard/mentor_dash/MentorDashboard";
import MentorHomeDashboard from "./Components/Dashboard/mentor_dash/MentorHome";
import MentorProfile from "./Components/Dashboard/mentor_dash/MentorProfile";
import MentorSettings from "./Components/Dashboard/mentor_dash/MentorSettings";
import MentorTask from "./Components/Dashboard/mentor_dash/MentorTask";


// ========================
// Execution Team Dashboard Pages
// ========================
import { Toaster } from "react-hot-toast";
import ExecutionDashboard from "./Components/Dashboard/execution_dash/ExecutionDashboard";
import ExecutionHomeDashboard from "./Components/Dashboard/execution_dash/ExecutionHomeDashboard";
import ExecutionProfile from "./Components/Dashboard/execution_dash/ExecutionProfile";
import ExecutionSetting from "./Components/Dashboard/execution_dash/ExecutionSetting";
import ExecutionTasks from "./Components/Dashboard/execution_dash/ExecutionTasks";
import InternCard from "./Components/cards/InternCard";
import  InternExcution from './Components/Dashboard/execution_dash/Interns'
import Privacy from "./common/Privacy";
import TermsAndService from "./common/TermsAndService";


// =====================================================
// Protected Route Component (Login + Role Based)
// =====================================================
function ProtectedRoute({ allowedRoles }) {

  const { user } = useAuth();

  // If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role not allowed → redirect to home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}


// =====================================================
// App Content Component
// =====================================================
function AppContent() {

  const location = useLocation();


  // Check if dashboard route
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  // Check if auth route
  const isAuthRoute =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/privacy" ||
    location.pathname === "/terms";


  return (
    <>
<Toaster
  position="top-right"
  toastOptions={{
    duration: 5000,
    style: {
      fontSize: "16px",
      background: "#fff",
      color: "#333",
      border: "1px solid #e5e7eb",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
      borderRadius: "12px",
      padding: "20px",
      minWidth: "300px",
      maxWidth: "400px",
    },

    // Default variants
    success: {
      style: {
        borderLeft: "6px solid #10b981",
        background: "linear-gradient(to right, #f0fdf4, #ffffff)",
        borderTop: "1px solid #dcfce7",
        borderRight: "1px solid #dcfce7",
        borderBottom: "1px solid #dcfce7",
      },
      iconTheme: {
        primary: "#10b981",
        secondary: "#fff",
      },
    },
    error: {
      style: {
        borderLeft: "6px solid #ef4444",
        background: "linear-gradient(to right, #fef2f2, #ffffff)",
        borderTop: "1px solid #fee2e2",
        borderRight: "1px solid #fee2e2",
        borderBottom: "1px solid #fee2e2",
      },
      iconTheme: {
        primary: "#ef4444",
        secondary: "#fff",
      },
    },
    info: {
      style: {
        borderLeft: "6px solid #3b82f6",
        background: "linear-gradient(to right, #eff6ff, #ffffff)",
        borderTop: "1px solid #dbeafe",
        borderRight: "1px solid #dbeafe",
        borderBottom: "1px solid #dbeafe",
      },
      iconTheme: {
        primary: "#3b82f6",
        secondary: "#fff",
      },
    },
    warning: {
      style: {
        borderLeft: "6px solid #f59e0b",
        background: "linear-gradient(to right, #fffbeb, #ffffff)",
        borderTop: "1px solid #fef3c7",
        borderRight: "1px solid #fef3c7",
        borderBottom: "1px solid #fef3c7",
      },
      iconTheme: {
        primary: "#f59e0b",
        secondary: "#fff",
      },
    },
    loading: {
      style: {
        borderLeft: "6px solid #6b7280",
        background: "linear-gradient(to right, #f3f4f6, #ffffff)",
        borderTop: "1px solid #e5e7eb",
        borderRight: "1px solid #e5e7eb",
        borderBottom: "1px solid #e5e7eb",
      },
      iconTheme: {
        primary: "#6b7280",
        secondary: "#fff",
      },
    },
    promise: {
      style: {
        borderLeft: "6px solid #8b5cf6",
        background: "linear-gradient(to right, #f5f3ff, #ffffff)",
        borderTop: "1px solid #ede9fe",
        borderRight: "1px solid #ede9fe",
        borderBottom: "1px solid #ede9fe",
      },
      iconTheme: {
        primary: "#8b5cf6",
        secondary: "#fff",
      },
    },

    // NEW VARIANTS START HERE

    // Vibrant Solid variants
    "success-solid": {
      style: {
        background: "#10b981",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 12px 20px -8px rgba(16, 185, 129, 0.5)",
        borderRadius: "12px",
        padding: "20px",
        fontWeight: "500",
      },
      icon: "✓",
      iconTheme: {
        primary: "#ffffff",
        secondary: "#10b981",
      },
    },
    "error-solid": {
      style: {
        background: "#ef4444",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 12px 20px -8px rgba(239, 68, 68, 0.5)",
        borderRadius: "12px",
        padding: "20px",
        fontWeight: "500",
      },
      icon: "✕",
      iconTheme: {
        primary: "#ffffff",
        secondary: "#ef4444",
      },
    },
    "info-solid": {
      style: {
        background: "#3b82f6",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 12px 20px -8px rgba(59, 130, 246, 0.5)",
        borderRadius: "12px",
        padding: "20px",
        fontWeight: "500",
      },
      icon: "ⓘ",
      iconTheme: {
        primary: "#ffffff",
        secondary: "#3b82f6",
      },
    },
    "warning-solid": {
      style: {
        background: "#f59e0b",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 12px 20px -8px rgba(245, 158, 11, 0.5)",
        borderRadius: "12px",
        padding: "20px",
        fontWeight: "500",
      },
      icon: "⚠",
      iconTheme: {
        primary: "#ffffff",
        secondary: "#f59e0b",
      },
    },

    // Pastel variants (enhanced)
    "success-pastel": {
      style: {
        background: "linear-gradient(145deg, #d1fae5, #ecfdf5)",
        color: "#065f46",
        borderLeft: "8px solid #10b981",
        borderRadius: "16px 12px 12px 16px",
        padding: "20px 24px",
        boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.3)",
        border: "1px solid #a7f3d0",
      },
      icon: "🌱",
    },
    "error-pastel": {
      style: {
        background: "linear-gradient(145deg, #fee2e2, #fef2f2)",
        color: "#991b1b",
        borderLeft: "8px solid #ef4444",
        borderRadius: "16px 12px 12px 16px",
        padding: "20px 24px",
        boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.3)",
        border: "1px solid #fecaca",
      },
      icon: "💔",
    },
    "info-pastel": {
      style: {
        background: "linear-gradient(145deg, #dbeafe, #eff6ff)",
        color: "#1e3a8a",
        borderLeft: "8px solid #3b82f6",
        borderRadius: "16px 12px 12px 16px",
        padding: "20px 24px",
        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
        border: "1px solid #bfdbfe",
      },
      icon: "💡",
    },
    "warning-pastel": {
      style: {
        background: "linear-gradient(145deg, #fef3c7, #fffbeb)",
        color: "#92400e",
        borderLeft: "8px solid #f59e0b",
        borderRadius: "16px 12px 12px 16px",
        padding: "20px 24px",
        boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.3)",
        border: "1px solid #fde68a",
      },
      icon: "🌟",
    },

    // Neon variants (enhanced)
    "success-neon": {
      style: {
        background: "#0a0f0f",
        color: "#10b981",
        border: "2px solid #10b981",
        boxShadow: "0 0 30px rgba(16, 185, 129, 0.8), inset 0 0 10px rgba(16, 185, 129, 0.3)",
        borderRadius: "8px",
        padding: "20px",
        textShadow: "0 0 8px rgba(16, 185, 129, 0.8)",
        fontWeight: "500",
      },
      icon: "⚡",
    },
    "error-neon": {
      style: {
        background: "#0f0a0a",
        color: "#ef4444",
        border: "2px solid #ef4444",
        boxShadow: "0 0 30px rgba(239, 68, 68, 0.8), inset 0 0 10px rgba(239, 68, 68, 0.3)",
        borderRadius: "8px",
        padding: "20px",
        textShadow: "0 0 8px rgba(239, 68, 68, 0.8)",
        fontWeight: "500",
      },
      icon: "🔥",
    },
    "info-neon": {
      style: {
        background: "#0a0a0f",
        color: "#3b82f6",
        border: "2px solid #3b82f6",
        boxShadow: "0 0 30px rgba(59, 130, 246, 0.8), inset 0 0 10px rgba(59, 130, 246, 0.3)",
        borderRadius: "8px",
        padding: "20px",
        textShadow: "0 0 8px rgba(59, 130, 246, 0.8)",
        fontWeight: "500",
      },
      icon: "💫",
    },
    "warning-neon": {
      style: {
        background: "#0f0a00",
        color: "#f59e0b",
        border: "2px solid #f59e0b",
        boxShadow: "0 0 30px rgba(245, 158, 11, 0.8), inset 0 0 10px rgba(245, 158, 11, 0.3)",
        borderRadius: "8px",
        padding: "20px",
        textShadow: "0 0 8px rgba(245, 158, 11, 0.8)",
        fontWeight: "500",
      },
      icon: "⚡",
    },

    // Glassmorphism variants (enhanced)
    "success-glass": {
      style: {
        background: "rgba(16, 185, 129, 0.1)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "#10b981",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(16, 185, 129, 0.3)",
        borderRadius: "16px",
        padding: "22px",
      },
      icon: "✨",
    },
    "error-glass": {
      style: {
        background: "rgba(239, 68, 68, 0.1)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "#ef4444",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(239, 68, 68, 0.3)",
        borderRadius: "16px",
        padding: "22px",
      },
      icon: "💢",
    },
    "info-glass": {
      style: {
        background: "rgba(59, 130, 246, 0.1)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "#3b82f6",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(59, 130, 246, 0.3)",
        borderRadius: "16px",
        padding: "22px",
      },
      icon: "🌀",
    },
    "warning-glass": {
      style: {
        background: "rgba(245, 158, 11, 0.1)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "#f59e0b",
        border: "1px solid rgba(245, 158, 11, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(245, 158, 11, 0.3)",
        borderRadius: "16px",
        padding: "22px",
      },
      icon: "⭐",
    },

    // Minimal variants
    "success-minimal": {
      style: {
        background: "#ffffff",
        color: "#10b981",
        border: "1px solid #10b981",
        borderRadius: "6px",
        padding: "16px 20px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      },
      icon: "✓",
    },
    "error-minimal": {
      style: {
        background: "#ffffff",
        color: "#ef4444",
        border: "1px solid #ef4444",
        borderRadius: "6px",
        padding: "16px 20px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      },
      icon: "✕",
    },
    "info-minimal": {
      style: {
        background: "#ffffff",
        color: "#3b82f6",
        border: "1px solid #3b82f6",
        borderRadius: "6px",
        padding: "16px 20px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      },
      icon: "ⓘ",
    },
    "warning-minimal": {
      style: {
        background: "#ffffff",
        color: "#f59e0b",
        border: "1px solid #f59e0b",
        borderRadius: "6px",
        padding: "16px 20px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      },
      icon: "⚠",
    },

    // Dark mode variants
    "success-dark": {
      style: {
        background: "#1e2a2a",
        color: "#10b981",
        border: "1px solid #2d3a3a",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
        borderRadius: "10px",
        padding: "18px 22px",
      },
      iconTheme: {
        primary: "#10b981",
        secondary: "#1e2a2a",
      },
    },
    "error-dark": {
      style: {
        background: "#2a1e1e",
        color: "#ef4444",
        border: "1px solid #3a2d2d",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
        borderRadius: "10px",
        padding: "18px 22px",
      },
      iconTheme: {
        primary: "#ef4444",
        secondary: "#2a1e1e",
      },
    },
    "info-dark": {
      style: {
        background: "#1e1e2a",
        color: "#3b82f6",
        border: "1px solid #2d2d3a",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
        borderRadius: "10px",
        padding: "18px 22px",
      },
      iconTheme: {
        primary: "#3b82f6",
        secondary: "#1e1e2a",
      },
    },
    "warning-dark": {
      style: {
        background: "#2a1e0a",
        color: "#f59e0b",
        border: "1px solid #3a2d1a",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
        borderRadius: "10px",
        padding: "18px 22px",
      },
      iconTheme: {
        primary: "#f59e0b",
        secondary: "#2a1e0a",
      },
    },

    // Gradient variants (new colors)
    "success-gradient": {
      style: {
        background: "linear-gradient(135deg, #10b981 0%, #34d399 50%, #059669 100%)",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 15px 25px -8px rgba(16, 185, 129, 0.5)",
        borderRadius: "16px",
        padding: "22px",
      },
      icon: "✓",
    },
    "error-gradient": {
      style: {
        background: "linear-gradient(135deg, #ef4444 0%, #f87171 50%, #dc2626 100%)",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 15px 25px -8px rgba(239, 68, 68, 0.5)",
        borderRadius: "16px",
        padding: "22px",
      },
      icon: "✕",
    },
    "info-gradient": {
      style: {
        background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #2563eb 100%)",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 15px 25px -8px rgba(59, 130, 246, 0.5)",
        borderRadius: "16px",
        padding: "22px",
      },
      icon: "ⓘ",
    },
    "warning-gradient": {
      style: {
        background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%)",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 15px 25px -8px rgba(245, 158, 11, 0.5)",
        borderRadius: "16px",
        padding: "22px",
      },
      icon: "⚠",
    },

    // Rainbow variants
    "success-rainbow": {
      style: {
        background: "linear-gradient(90deg, #10b981, #34d399, #10b981, #34d399)",
        backgroundSize: "300% 100%",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 10px 20px rgba(16, 185, 129, 0.3)",
        borderRadius: "12px",
        padding: "20px",
        animation: "gradient 3s ease infinite",
      },
      icon: "🌈",
    },
    "error-rainbow": {
      style: {
        background: "linear-gradient(90deg, #ef4444, #f87171, #ef4444, #f87171)",
        backgroundSize: "300% 100%",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 10px 20px rgba(239, 68, 68, 0.3)",
        borderRadius: "12px",
        padding: "20px",
        animation: "gradient 3s ease infinite",
      },
      icon: "🔥",
    },

    // Bordered variants
    "success-bordered": {
      style: {
        background: "#ffffff",
        color: "#10b981",
        border: "3px solid #10b981",
        borderRadius: "20px",
        padding: "18px 24px",
        boxShadow: "none",
      },
      icon: "✓",
    },
    "error-bordered": {
      style: {
        background: "#ffffff",
        color: "#ef4444",
        border: "3px solid #ef4444",
        borderRadius: "20px",
        padding: "18px 24px",
        boxShadow: "none",
      },
      icon: "✕",
    },

    // Shadow variants
    "success-shadow": {
      style: {
        background: "linear-gradient(145deg, #ffffff, #f0fdf4)",
        color: "#065f46",
        border: "none",
        boxShadow: "20px 20px 30px rgba(16, 185, 129, 0.2), -10px -10px 20px #ffffff",
        borderRadius: "20px",
        padding: "20px",
      },
      icon: "✨",
    },
    "error-shadow": {
      style: {
        background: "linear-gradient(145deg, #ffffff, #fef2f2)",
        color: "#991b1b",
        border: "none",
        boxShadow: "20px 20px 30px rgba(239, 68, 68, 0.2), -10px -10px 20px #ffffff",
        borderRadius: "20px",
        padding: "20px",
      },
      icon: "💔",
    },

    // Outline variants
    "success-outline": {
      style: {
        background: "transparent",
        color: "#10b981",
        border: "2px dashed #10b981",
        borderRadius: "8px",
        padding: "18px 22px",
        boxShadow: "none",
      },
      icon: "✓",
    },
    "error-outline": {
      style: {
        background: "transparent",
        color: "#ef4444",
        border: "2px dotted #ef4444",
        borderRadius: "8px",
        padding: "18px 22px",
        boxShadow: "none",
      },
      icon: "✕",
    },

    // Soft variants
    "success-soft": {
      style: {
        background: "#ecfdf5",
        color: "#065f46",
        border: "none",
        borderRadius: "30px",
        padding: "16px 28px",
        boxShadow: "0 4px 10px rgba(16, 185, 129, 0.1)",
      },
      icon: "🌿",
    },
    "error-soft": {
      style: {
        background: "#fef2f2",
        color: "#991b1b",
        border: "none",
        borderRadius: "30px",
        padding: "16px 28px",
        boxShadow: "0 4px 10px rgba(239, 68, 68, 0.1)",
      },
      icon: "🌸",
    },
    "info-soft": {
      style: {
        background: "#eff6ff",
        color: "#1e3a8a",
        border: "none",
        borderRadius: "30px",
        padding: "16px 28px",
        boxShadow: "0 4px 10px rgba(59, 130, 246, 0.1)",
      },
      icon: "🐚",
    },
    "warning-soft": {
      style: {
        background: "#fffbeb",
        color: "#92400e",
        border: "none",
        borderRadius: "30px",
        padding: "16px 28px",
        boxShadow: "0 4px 10px rgba(245, 158, 11, 0.1)",
      },
      icon: "🍂",
    },

    // Compact variants
    "success-compact": {
      style: {
        background: "#10b981",
        color: "#ffffff",
        border: "none",
        borderRadius: "4px",
        padding: "12px 16px",
        fontSize: "14px",
        minWidth: "200px",
      },
      icon: "✓",
    },
    "error-compact": {
      style: {
        background: "#ef4444",
        color: "#ffffff",
        border: "none",
        borderRadius: "4px",
        padding: "12px 16px",
        fontSize: "14px",
        minWidth: "200px",
      },
      icon: "✕",
    },
  }}
/>


      {/* Navbar only on public pages */}
      {!isDashboardRoute && !isAuthRoute && <Navbar />}

      <Routes>

        {/* ========================
            PUBLIC ROUTES
        ======================== */}

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<TermsAndService />} />




        {/* ========================
            MENTOR PROTECTED ROUTES
        ======================== */}

        <Route element={<ProtectedRoute allowedRoles={["Mentor"]} />}>
          <Route path="/dashboard/Mentor" element={<MentorDashboard />}>
                <Route index element={<MentorHomeDashboard />} />
                <Route path="home" element={<MentorHomeDashboard />} />
                <Route path="interns" element={<Interns />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="interns/:" element={<InternCard />} />
                <Route path="execution-team" element={< ExecutionTeam/>} />
                <Route path="lor-requests" element={<InternsLorRequest />} />
                <Route path="task" element={<MentorTask />} />
                <Route path="profile" element={<MentorProfile />} />
                <Route path="setting" element={<MentorSettings />} />
          </Route>

        </Route>


        {/* ========================
            EXECUTION TEAM PROTECTED ROUTES
        ======================== */}

        <Route element={<ProtectedRoute allowedRoles={["ExecutionTeam"]} />}>
          <Route path="/dashboard/ExecutionTeam" element={<ExecutionDashboard />}>
                <Route index element={<ExecutionHomeDashboard />} />
                <Route path="home" element={<ExecutionHomeDashboard />} />
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


      {/* Footer only on public pages */}
      {!isDashboardRoute && !isAuthRoute && <Footer />}

    </>
  );
}


// =====================================================
// Main App Component
// =====================================================
function App() {
  return <AppContent />;
}

export default App;
