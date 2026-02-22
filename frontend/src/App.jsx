import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthContext from "./context/AuthContext";
import { useContext } from "react";
import Dashboard from "./pages/Kader/Dashboard";
import Homepage from "./pages/homepage";
import ManajemenBalita from "./pages/Kader/ManajemenBalita/ManajemenBalita";
import CreateForm from "./pages/Kader/ManajemenBalita/Create";
import UpdateFormBalita from "./pages/Kader/ManajemenBalita/Update";
import DetailFormBalita from "./pages/Kader/ManajemenBalita/Detail";
import Penimbangan from "./pages/Kader/ManajemenPenimbangan";
import CreatePenimbangan from "./pages/Kader/ManajemenPenimbangan/Create";
import DetailPenimbangan from "./pages/Kader/ManajemenPenimbangan/Detail";
import UpdatePenimbangan from "./pages/Kader/ManajemenPenimbangan/Update";
import DeteksiStunting from "./pages/Kader/Deteksi";
import Riwayat from "./pages/Kader/RiwayatGrafik";
import Statistik from "./pages/Kader/Statistik";
import DashboardOrangTua from "./pages/OrangTua/Dashboard";
import Laporan from "./pages/Kader/Laporan";
import Notifikasi from "./pages/Kader/Notifikasi";
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
    {
      path: "/riwayat",
      element: <Riwayat />,
    },
    {
      path: "/statistik",
      element: <Statistik />,
    },
    {
      path: "/laporan",
      element: <Laporan />,
    },
    {
      path: "/notif",
      element: <Notifikasi />,
    },





    {
      path: "/DashboardOrangTua",
      element: <DashboardOrangTua />,
    },
  ]);

  return (
    <>
      <RouterProvider router={myRouter} />
    </>
  );
};

export default App;
