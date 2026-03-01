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
    location.pathname === "/register";

  return (
    <>
<Toaster
  position="top-right"
  toastOptions={{
    duration: 2000,
    style: {
      fontSize: "16px", // Increased from 14px
      background: "#fff",
      color: "#333",
      border: "1px solid #e5e7eb",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
      borderRadius: "12px", // Increased from 8px
      padding: "20px", // Increased from 16px
      minWidth: "320px", // Added minimum width
      maxWidth: "400px", // Added maximum width
    },
    success: {
      style: {
        borderLeft: "6px solid #10b981", // Thicker border
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

    // Material Design style variants with larger icons
    "success-material": {
      style: {
        backgroundColor: "#10b981",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 12px 20px -8px rgba(16, 185, 129, 0.4)",
        borderRadius: "16px",
        padding: "20px",
      },
      icon: "🎉", // Custom icon
      iconTheme: {
        primary: "#fff",
        secondary: "#10b981",
      },
    },
    "error-material": {
      style: {
        backgroundColor: "#ef4444",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 12px 20px -8px rgba(239, 68, 68, 0.4)",
        borderRadius: "16px",
        padding: "20px",
      },
      icon: "⚠️", // Custom icon
      iconTheme: {
        primary: "#fff",
        secondary: "#ef4444",
      },
    },
    "info-material": {
      style: {
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 12px 20px -8px rgba(59, 130, 246, 0.4)",
        borderRadius: "16px",
        padding: "20px",
      },
      icon: "ℹ️", // Custom icon
      iconTheme: {
        primary: "#fff",
        secondary: "#3b82f6",
      },
    },
    "warning-material": {
      style: {
        backgroundColor: "#f59e0b",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 12px 20px -8px rgba(245, 158, 11, 0.4)",
        borderRadius: "16px",
        padding: "20px",
      },
      icon: "⚡", // Custom icon
      iconTheme: {
        primary: "#fff",
        secondary: "#f59e0b",
      },
    },

    // Gradient variants with larger icons
    "success-gradient": {
      style: {
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 12px 20px -8px rgba(16, 185, 129, 0.5)",
        borderRadius: "16px",
        padding: "22px",
      },
      icon: "✅", // Custom icon
      iconTheme: {
        primary: "#fff",
        secondary: "#10b981",
      },
    },
    "error-gradient": {
      style: {
        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 12px 20px -8px rgba(239, 68, 68, 0.5)",
        borderRadius: "16px",
        padding: "22px",
      },
      icon: "❌", // Custom icon
      iconTheme: {
        primary: "#fff",
        secondary: "#ef4444",
      },
    },
    "info-gradient": {
      style: {
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 12px 20px -8px rgba(59, 130, 246, 0.5)",
        borderRadius: "16px",
        padding: "22px",
      },
      icon: "🔵", // Custom icon
      iconTheme: {
        primary: "#fff",
        secondary: "#3b82f6",
      },
    },
    "warning-gradient": {
      style: {
        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 12px 20px -8px rgba(245, 158, 11, 0.5)",
        borderRadius: "16px",
        padding: "22px",
      },
      icon: "🔶", // Custom icon
      iconTheme: {
        primary: "#fff",
        secondary: "#f59e0b",
      },
    },

    // New Pastel variants
    "success-pastel": {
      style: {
        background: "#d1fae5",
        color: "#065f46",
        borderLeft: "6px solid #10b981",
        borderTop: "1px solid #a7f3d0",
        borderRight: "1px solid #a7f3d0",
        borderBottom: "1px solid #a7f3d0",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 8px 16px -4px rgba(16, 185, 129, 0.2)",
      },
      icon: "🌱", // Custom icon
    },
    "error-pastel": {
      style: {
        background: "#fee2e2",
        color: "#991b1b",
        borderLeft: "6px solid #ef4444",
        borderTop: "1px solid #fecaca",
        borderRight: "1px solid #fecaca",
        borderBottom: "1px solid #fecaca",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 8px 16px -4px rgba(239, 68, 68, 0.2)",
      },
      icon: "💔", // Custom icon
    },
    "info-pastel": {
      style: {
        background: "#dbeafe",
        color: "#1e3a8a",
        borderLeft: "6px solid #3b82f6",
        borderTop: "1px solid #bfdbfe",
        borderRight: "1px solid #bfdbfe",
        borderBottom: "1px solid #bfdbfe",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 8px 16px -4px rgba(59, 130, 246, 0.2)",
      },
      icon: "💡", // Custom icon
    },
    "warning-pastel": {
      style: {
        background: "#fef3c7",
        color: "#92400e",
        borderLeft: "6px solid #f59e0b",
        borderTop: "1px solid #fde68a",
        borderRight: "1px solid #fde68a",
        borderBottom: "1px solid #fde68a",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 8px 16px -4px rgba(245, 158, 11, 0.2)",
      },
      icon: "🌟", // Custom icon
    },

    // New Neon variants
    "success-neon": {
      style: {
        background: "#000",
        color: "#10b981",
        border: "2px solid #10b981",
        boxShadow: "0 0 20px rgba(16, 185, 129, 0.6)",
        borderRadius: "8px",
        padding: "20px",
        textShadow: "0 0 8px rgba(16, 185, 129, 0.5)",
      },
      icon: "⚡", // Custom icon
      iconTheme: {
        primary: "#10b981",
        secondary: "#000",
      },
    },
    "error-neon": {
      style: {
        background: "#000",
        color: "#ef4444",
        border: "2px solid #ef4444",
        boxShadow: "0 0 20px rgba(239, 68, 68, 0.6)",
        borderRadius: "8px",
        padding: "20px",
        textShadow: "0 0 8px rgba(239, 68, 68, 0.5)",
      },
      icon: "🔥", // Custom icon
      iconTheme: {
        primary: "#ef4444",
        secondary: "#000",
      },
    },
    "info-neon": {
      style: {
        background: "#000",
        color: "#3b82f6",
        border: "2px solid #3b82f6",
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)",
        borderRadius: "8px",
        padding: "20px",
        textShadow: "0 0 8px rgba(59, 130, 246, 0.5)",
      },
      icon: "💫", // Custom icon
      iconTheme: {
        primary: "#3b82f6",
        secondary: "#000",
      },
    },
    "warning-neon": {
      style: {
        background: "#000",
        color: "#f59e0b",
        border: "2px solid #f59e0b",
        boxShadow: "0 0 20px rgba(245, 158, 11, 0.6)",
        borderRadius: "8px",
        padding: "20px",
        textShadow: "0 0 8px rgba(245, 158, 11, 0.5)",
      },
      icon: "⚡", // Custom icon
      iconTheme: {
        primary: "#f59e0b",
        secondary: "#000",
      },
    },

    // Glassmorphism variants
    "success-glass": {
      style: {
        background: "rgba(16, 185, 129, 0.1)",
        backdropFilter: "blur(10px)",
        color: "#10b981",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(16, 185, 129, 0.2)",
        borderRadius: "16px",
        padding: "22px",
      },
      icon: "✨", // Custom icon
    },
    "error-glass": {
      style: {
        background: "rgba(239, 68, 68, 0.1)",
        backdropFilter: "blur(10px)",
        color: "#ef4444",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(239, 68, 68, 0.2)",
        borderRadius: "16px",
        padding: "22px",
      },
      icon: "💢", // Custom icon
    },
    "info-glass": {
      style: {
        background: "rgba(59, 130, 246, 0.1)",
        backdropFilter: "blur(10px)",
        color: "#3b82f6",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(59, 130, 246, 0.2)",
        borderRadius: "16px",
        padding: "22px",
      },
      icon: "🌀", // Custom icon
    },
    "warning-glass": {
      style: {
        background: "rgba(245, 158, 11, 0.1)",
        backdropFilter: "blur(10px)",
        color: "#f59e0b",
        border: "1px solid rgba(245, 158, 11, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(245, 158, 11, 0.2)",
        borderRadius: "16px",
        padding: "22px",
      },
      icon: "⭐", // Custom icon
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
                <Route path="interns" element={<Interns />} />
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
