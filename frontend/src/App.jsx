import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthContext from "./context/AuthContext";
import { useContext } from "react";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/homepage";
import ManajemenBalita from "./pages/ManajemenBalita/ManajemenBalita";
import CreateForm from "./pages/ManajemenBalita/Create";
import UpdateFormBalita from "./pages/ManajemenBalita/Update";
import DetailFormBalita from "./pages/ManajemenBalita/Detail";
import Penimbangan from "./pages/ManajemenPenimbangan";
import CreatePenimbangan from "./pages/ManajemenPenimbangan/Create";
import DetailPenimbangan from "./pages/ManajemenPenimbangan/Detail";
import UpdatePenimbangan from "./pages/ManajemenPenimbangan/Update";
import DeteksiStunting from "./pages/Deteksi";
const RequireAuth = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? children : <Navigate to="/login" />;
};
const App = () => {
  const myRouter = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/manajemenbalita",
      element: <ManajemenBalita />,
    },
    {
      path: "/createmanajemenbalita",
      element: <CreateForm />,
    },
    {
      path: "/detailmanajemenbalita",
      element: <DetailFormBalita />,
    },
    {
      path: "/updatemanajemenbalita",
      element: <UpdateFormBalita />,
    },
    {
      path: "/manajemenpenimbangan",
      element: <Penimbangan />,
    },
    {
      path: "/createpenimbangan",
      element: <CreatePenimbangan />,
    },
    {
      path: "/detailpenimbangan",
      element: <DetailPenimbangan />,
    },
    {
      path: "/updatepenimbangan",
      element: <UpdatePenimbangan />,
    },
    {
      path: "/deteksidini",
      element: <DeteksiStunting />,
    },
  ]);

  return (
    <>
      <RouterProvider router={myRouter} />
    </>
  );
};

export default App;
