import LabeledInput from "../Elements/LabeledInput";
import { useForm } from "react-hook-form";
import Button from "../Elements/Button/Index";
import { FcGoogle } from "react-icons/fc";
const FormRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const onErrors = (errors) => console.error(errors);

  return (
    <>
      <form onSubmit={handleSubmit(onErrors)}>
        <div className="mb-6">
          <LabeledInput
            label="Nama Lengkap"
            type="name"
            placeholder="Alexander Burgers"
            name="name"
            register={{
              ...register("name", {
                required: "Nama lengkap tidak boleh kosong!"
              }),
            }}
          />
          {errors?.name && (
            <div className="text-center text-red-500">
              {errors.name.message}
            </div>
          )}
        </div>
        <div className="mb-6">
          <LabeledInput
            label="Email address"
            type="email"
            placeholder="hello@example.com"
            name="email"
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
              ...register("password", { required: "Password tidak boleh kosong" }),
            }}
          />
          {errors?.password && (
            <div className="text-center text-red-500">
              {errors.password.message}{" "}
            </div>
          )}
        </div>
        <div className="mb-6">
          <LabeledInput
            label="Nomor Telepon"
            type="text" // gunakan text, jangan "no_telpon"
            placeholder="081234567890"
            name="no_telpon"
            register={{
              ...register("no_telpon", {
                required: "Nomor telepon wajib diisi",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Nomor telepon hanya boleh angka",
                },
                minLength: {
                  value: 12,
                  message: "Nomor telepon minimal 12 digit",
                },
                maxLength: {
                  value: 13,
                  message: "Nomor telepon maksimal 13 digit",
                },
              }),
            }}
          />
          {errors?.no_telpon && (
            <div className="text-center text-red-500">
              {errors.no_telpon.message}
            </div>
          )}
        </div>
        <div className="mb-6">
          <LabeledInput
            label="Alamat"
            type="text" // tetap pakai text
            placeholder="Masukkan alamat lengkap"
            name="alamat"
            register={{
              ...register("alamat", {
                required: "Alamat wajib diisi",
                minLength: {
                  value: 10,
                  message: "Alamat terlalu pendek, minimal 10 karakter",
                },
                maxLength: {
                  value: 200,
                  message: "Alamat terlalu panjang, maksimal 200 karakter",
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
    </>
  );
};
export default FormRegister;
