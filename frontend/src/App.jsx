import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthContext from "./context/AuthContext";
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

import DashboardOrangTua from "./pages/OrangTua/Dashboard";
import Laporan from "./pages/Kader/Laporan";
import Notifikasi from "./pages/Kader/Notifikasi";
import EdukasiKesehatanAnak from "./pages/OrangTua/Edukasi";
import RiwayatPemeriksaan from "./pages/OrangTua/Riwayat";
import Deteksi from "./pages/OrangTua/Deteksi";
import NotifikasiOrtu from "./pages/OrangTua/Notifikasi";
const RequireAuth = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};
const App = () => {
  const myRouter = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/admin/dashboard",
      element: (
        <RequireAuth role="admin">
          <Dashboard />
        </RequireAuth>
      ),
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
    {
      path: "/EdukasiOrangTua",
      element: <EdukasiKesehatanAnak />,
    },
    {
      path: "/RiwayatOrangTua",
      element: <RiwayatPemeriksaan />,
    },
    {
      path: "/DeteksiOrangTua",
      element: <Deteksi />,
    },
    {
      path: "/NotifikasiOrangTua",
      element: <NotifikasiOrtu />,
    },
  ]);

  return (
    <>
      <RouterProvider router={myRouter} />
    </>
  );
};

export default App;
