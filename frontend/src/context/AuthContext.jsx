import { createContext, useState, useEffect } from "react";
import api from "../services/api"; // axios instance kamu

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //Ambil user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        // ⚡ Set header Authorization sebelum request
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const res = await api.get("/user"); // sekarang Laravel bisa kenali token
        setUser(res.data);
      } catch (error) {
        console.error("Gagal ambil user:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  //LOGIN
  const login = async (email, password) => {
    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // simpan token
      localStorage.setItem("token", token);

      // set default header axios
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login gagal",
      };
    }
  };

  //LOGOUT
  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook

export default AuthProvider;
