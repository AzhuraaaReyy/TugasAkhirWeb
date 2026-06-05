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
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const res = await api.get("/user");
        setUser(res.data);

        const role = res.data.role;

        if (role === "kader") {
          navigate("/kader/dashboard");
        } else if (role === "orangtua" && !res.data.no_telp) {
          // akun Google belum punya nomor HP ->
          // lengkapi dulu agar tertaut dengan data anak dari kader
          navigate("/orangtua/lengkapinotelp");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // WAJIB ada return — komponen tanpa return membuat React error
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Memproses login Google...</p>
    </div>
  );
}
