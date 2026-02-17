import { useForm } from "react-hook-form";
import LabeledInput from "../Elements/LabeledInput";
import CheckBox from "../Elements/CheckBox/Index";
{
  /*import { useContext, useState } from "react";*/
}
import Button from "../Elements/Button/Index";
import { FcGoogle } from "react-icons/fc";
const FormLogin = () => {
  {
    /* const { setMsg, setOpen, setIsLoading, msg, open } = useContext(NotifContext);
  const { setIsLoggedIn, setName } = useContext(AuthContext);
  const navigate = useNavigate();
*/
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const onErrors = (errors) => console.error(errors);
  const onFormSubmit = (data) => {
    console.log("LOGIN DATA:", data);
  };
  const handleGoogleLogin = () => {
    // redirect ke backend OAuth endpoint
    window.location.href = "http://localhost:5000/auth/google";
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
