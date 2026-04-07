import { useForm } from "react-hook-form";

import LabeledInput from "../Elements/LabeledInput";
import CheckBox from "../Elements/CheckBox/Index";
{
  /*import { useContext, useState } from "react";*/
}
import Button from "../Elements/Button/Index";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
const FormLogin = () => {
  {
    /* const { setMsg, setOpen, setIsLoading, msg, open } = useContext(NotifContext);
  const { setIsLoggedIn, setName } = useContext(AuthContext);
  const navigate = useNavigate();
*/
  }
  const { login, setUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const onErrors = (errors) => console.error(errors);
  const onFormSubmit = async (data) => {
    const res = await login(data.email, data.password);

    if (!res.success) {
      setError("root", {
        type: "manual",
        message: res.message,
      });
      return;
    }
    setUser(res.user);
    const role = res.user.role;

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "kader") {
      navigate("/kader/dashboard");
    } else {
      navigate("/orangtua/dashboard");
    }
  };
  const handleGoogleLogin = () => {
    // redirect ke backend OAuth endpoint
    window.location.href = "http://127.0.0.1:8000/auth/google/redirect";
  };

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit, onErrors)}>
        <div className="mb-6">
          <LabeledInput
            label="Email address"
            type="email"
            placeholder="hello@example.com"
            name="email"
            register={{
              ...register("email", {
                required: "Email address is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }),
            }}
          />
          {errors?.email && (
            <div className="text-center text-red-500">
              {errors.email.message}
            </div>
          )}
        </div>
        <div className="mb-6">
          <LabeledInput
            label="Password"
            type="password"
            placeholder="*************"
            name="password"
            register={{
              ...register("password", { required: "password is required" }),
            }}
          />
          {errors?.password && (
            <div className="text-center text-red-500">
              {errors.password.message}{" "}
            </div>
          )}
        </div>
        {errors?.root && (
          <div className="text-center text-red-500 mb-3">
            {errors.root.message}
          </div>
        )}
        <div className="mb-3">
          <CheckBox label="Keep me signed in" name="status" />
        </div>

        {/*  LOGIN */}
        <Button
          variant="primary"
          type="submit"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Loading..." : "Login"}
        </Button>

        {/*{msg && (
        <CustomizedSnackbars
          severity={msg.severity}
          message={msg.desc}
          open={open}
          setOpen={setOpen}
        />
      )}*/}
      </form>
      {/* Divider */}
      <div className="flex items-center gap-3 mt-3">
        <hr className="flex-1 border-gray-300" />
        <span className="text-gray-400 text-sm">or</span>
        <hr className="flex-1 border-gray-300" />
      </div>
      <div className="space-y-3 mt-3">
        <Button variant="google" type="button" onClick={handleGoogleLogin}>
          <FcGoogle className="text-lg" />
          Continue with Google
        </Button>
      </div>
    </>
  );
};
export default FormLogin;
