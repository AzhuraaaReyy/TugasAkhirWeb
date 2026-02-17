import AuthLayouts from "../layouts/AuthLayouts";
import FormLogin from "../components/Fragments/FormLogin";
const Login = () => {
  return (
    <AuthLayouts type="login">
      <FormLogin />
    </AuthLayouts>
  );
};
export default Login;
