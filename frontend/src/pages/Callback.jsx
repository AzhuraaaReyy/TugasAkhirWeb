import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import api from "@/services/api";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // ✅ simpan token
        localStorage.setItem("token", token);

        // ✅ set header axios (WAJIB)
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // 🔥 AMBIL USER DARI BACKEND
        const res = await api.get("/user");

        // ✅ set user dari backend
        setUser(res.data);

        const role = res.data.role;

        // ✅ redirect sesuai role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "kader") {
          navigate("/kader/dashboard");
        } else {
          navigate("/orangtua/dashboard");
        }
      } catch (error) {
        console.error("Google login gagal:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    handleLogin();
  }, []);
}
