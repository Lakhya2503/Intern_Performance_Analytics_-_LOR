import { Loader } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  currentUser,
  loggedInUser,
  loggedOutUser,
  registerUser,
} from "../api";

import { LocalStorage } from "../utils";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================

  const [user, setUser] = useState(() => LocalStorage.get("user") || null);
  const [role, setRole] = useState(() => LocalStorage.get("user")?.role || "Mentor");
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const isAuthenticated = !!user;

  const initialized = useRef(false);

  // =========================
  // SAVE USER
  // =========================

  const persistUser = useCallback((userData) => {

    if (!userData) return;

    setUser(prev => {
      if (JSON.stringify(prev) === JSON.stringify(userData)) return prev;
      return userData;
    });

    setRole(prev => {
      if (prev === userData.role) return prev;
      return userData.role;
    });

    LocalStorage.set("user", userData);

  }, []);

  // =========================
  // CLEAR AUTH
  // =========================

  const clearAuth = useCallback(() => {

    LocalStorage.remove("user");

    setUser(prev => prev ? null : prev);
    setRole(prev => prev ? null : prev);

  }, []);

  // =========================
  // FETCH USER
  // =========================

  const fetchCurrentUser = useCallback(async () => {

    try {

      const res = await currentUser();

      const userData =
        res?.data?.data?.user ||
        res?.data?.data ||
        null;

      if (userData) {
        persistUser(userData);
        return userData;
      }

      clearAuth();
      return null;

    } catch {

      clearAuth();
      return null;

    }

  }, [persistUser, clearAuth]);

  // =========================
  // INIT (RUN ONLY ONCE)
  // =========================

  useEffect(() => {

    if (initialized.current) return;

    initialized.current = true;

    const init = async () => {

      try {

        const storedUser = LocalStorage.get("user");

        if (storedUser) {
          await fetchCurrentUser();
        }

      } finally {

        setIsInitializing(false);

      }

    };

    init();

  }, [fetchCurrentUser]);

  // =========================
  // LOGIN
  // =========================

  const login = useCallback(async (payload) => {

    setLoading(true);

    try {

      await loggedInUser(payload);

      const userData = await fetchCurrentUser();

      if (!userData) throw new Error("User fetch failed");

      toast.success("login successfully")

      navigate(`/dashboard/${userData.role}`, { replace: true });

      return { success: true };

    } finally {

      setLoading(false);

    }

  }, [fetchCurrentUser, navigate]);

  // =========================
  // REGISTER
  // =========================

  const register = useCallback(async (payload) => {

    setLoading(true);

    try {

      const res = await registerUser(payload);
        toast.success("login successfully")
      return { success: true, data: res.data };

    } finally {

      setLoading(false);

    }

  }, []);

  // =========================
  // LOGOUT
  // =========================

  const logout = useCallback(async () => {

    setLoading(true);

    try {
      await loggedOutUser();
        toast.success("log out successfully")
    } finally {

      clearAuth();

      navigate("/login", { replace: true });

      setLoading(false);

    }

  }, [clearAuth, navigate]);

  // =========================
  // MEMO VALUE
  // =========================

  const value = useMemo(() => ({
    user,
    role,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  }), [user, role, loading, isAuthenticated, login, register, logout]);

  // =========================
  // LOADING SCREEN
  // =========================

  if (isInitializing) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Loader className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

};
