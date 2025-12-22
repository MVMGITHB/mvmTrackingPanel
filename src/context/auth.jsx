import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
  });

  /**
   * 🔐 Load auth from localStorage
   */
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");

    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);

      setAuth(parsed);

      // ✅ MUST include Bearer
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${parsed.token}`;
    }
  }, []);

  /**
   * 🔄 Sync auth → localStorage & axios
   */
  useEffect(() => {
    if (auth?.token) {
      localStorage.setItem("auth", JSON.stringify(auth));

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${auth.token}`;
    } else {
      localStorage.removeItem("auth");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
