import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

// ========================
// Public Pages
// ========================
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./common/NotFound";

// ========================
// Auth Pages
// ========================
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// ========================
// Layout
// ========================
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";

// ========================
// Mentor Dashboard Pages
// ========================
import MentorDashboard from "./Components/Dashboard/mentor_dash/MentorDashboard";
import MentorHomeDashboard from "./Components/Dashboard/mentor_dash/MentorHome";
import MentorTask from "./Components/Dashboard/mentor_dash/MentorTask";
import Interns from "./Components/Dashboard/mentor_dash/Interns";
import InternsLorRequest from "./Components/Dashboard/mentor_dash/InternsLorRequest";
import Analytics from "./Components/Dashboard/mentor_dash/Analytics";
import MentorProfile from "./Components/Dashboard/mentor_dash/MentorProfile";
import MentorSettings from "./Components/Dashboard/mentor_dash/MentorSettings";
import ExecutionTeam from './Components/Dashboard/mentor_dash/ExecutionTeam'


// ========================
// Execution Team Dashboard Pages
// ========================
import ExecutionDashboard from "./Components/Dashboard/execution_dash/ExecutionDashboard";
import ExecutionHomeDashboard from "./Components/Dashboard/execution_dash/ExecutionHomeDashboard";
import ExecutionTask from "./Components/Dashboard/execution_dash/ExecutionTask";
import ExecutionProfile from "./Components/Dashboard/execution_dash/ExecutionProfile";
import ExecutionSetting from "./Components/Dashboard/execution_dash/ExecutionSetting";


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
    location.pathname === "/signup";

  return (
    <>

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
        <Route path="/signup" element={<Register />} />


        {/* ========================
            MENTOR PROTECTED ROUTES
        ======================== */}

        <Route element={<ProtectedRoute allowedRoles={["Mentor"]} />}>
          <Route path="/dashboard/Mentor" element={<MentorDashboard />}>
                <Route index element={<MentorHomeDashboard />} />
                <Route path="home" element={<MentorHomeDashboard />} />
                <Route path="interns" element={<Interns />} />
                <Route path="analytics" element={<Analytics />} />
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
                <Route path="task" element={<ExecutionTask />} />
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
