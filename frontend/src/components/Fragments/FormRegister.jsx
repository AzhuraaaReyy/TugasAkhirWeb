import { useForm } from "react-hook-form";
import LabeledInput from "../Elements/LabeledInput";
import Button from "../Elements/Button/Index";
import api from "../../services/api"; // axios instance
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const FormRegister = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); // ambil setUser dari context
  const [msg, setMsg] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        no_telp: data.no_telpon,
        alamat: data.alamat,
      });

      const { token, user } = res.data;

      // Simpan token di localStorage (interceptor sudah handle header)
      localStorage.setItem("token", token);

      // Update user di context
      setUser(user);

      setMsg({ type: "success", text: res.data.message });

      // redirect ke dashboard orangtua
      navigate("/login");
    } catch (error) {
      setMsg({
        type: "error",
        text: error.response?.data?.message || "Gagal register",
      });
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Nama */}
      <div className="mb-6">
        <LabeledInput
          label="Nama Lengkap"
          type="text"
          placeholder="Alexander Burgers"
          register={{
            ...register("name", {
              required: "Nama lengkap tidak boleh kosong!",
            }),
          }}
        />
        {errors?.name && (
          <div className="text-center text-red-500">{errors.name.message}</div>
        )}
      </div>

      {/* Email */}
      <div className="mb-6">
        <LabeledInput
          label="Email"
          type="email"
          placeholder="hello@example.com"
          register={{
            ...register("email", {
              required: "Email tidak boleh kosong!",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email tidak sesuai!",
              },
            }),
          }}
        />
        {errors?.email && (
          <div className="text-center text-red-500">{errors.email.message}</div>
        )}
      </div>

      {/* Password */}
      <div className="mb-6">
        <LabeledInput
          label="Password"
          type="password"
          placeholder="*********"
          register={{
            ...register("password", {
              required: "Password tidak boleh kosong",
              minLength: { value: 8, message: "Password minimal 6 karakter" },
            }),
          }}
        />
        {errors?.password && (
          <div className="text-center text-red-500">
            {errors.password.message}
          </div>
        )}
      </div>

      {/* Nomor Telepon */}
      <div className="mb-6">
        <LabeledInput
          label="Nomor Telepon"
          type="text"
          placeholder="081234567890"
          register={{
            ...register("no_telpon", {
              required: "Nomor telepon wajib diisi",
              pattern: {
                value: /^[0-9]+$/,
                message: "Nomor telepon hanya boleh angka",
              },
              minLength: { value: 12, message: "Minimal 12 digit" },
              maxLength: { value: 13, message: "Maksimal 13 digit" },
            }),
          }}
        />
        {errors?.no_telpon && (
          <div className="text-center text-red-500">
            {errors.no_telpon.message}
          </div>
        )}
      </div>

      {/* Alamat */}
      <div className="mb-6">
        <LabeledInput
          label="Alamat"
          type="text"
          placeholder="Masukkan alamat lengkap"
          register={{
            ...register("alamat", {
              required: "Alamat wajib diisi",
              minLength: { value: 10, message: "Alamat minimal 10 karakter" },
              maxLength: {
                value: 200,
                message: "Alamat maksimal 200 karakter",
              },
            }),
          }}
        />
        {errors?.alamat && (
          <div className="text-center text-red-500">
            {errors.alamat.message}
          </div>
        )}
      </div>

      {/* Submit */}
      <Button
        variant="primary"
        type="submit"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? "Loading..." : "Daftar"}
      </Button>

      {msg && (
        <div
          className={`mt-4 text-center ${msg.type === "success" ? "text-green-500" : "text-red-500"}`}
        >
          {msg.text}
        </div>
      )}
    </form>
  );
};

export default FormRegister;
