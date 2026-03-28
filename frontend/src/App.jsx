import {
  Outlet,
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
import { useAuth } from "./context/useAuth";
import DashboardOrangTua from "./pages/OrangTua/Dashboard";
import Laporan from "./pages/Kader/Laporan";
import Notifikasi from "./pages/Kader/Notifikasi";
import EdukasiKesehatanAnak from "./pages/OrangTua/Edukasi";
import RiwayatPemeriksaan from "./pages/OrangTua/Riwayat";
import Deteksi from "./pages/OrangTua/Deteksi";
import NotifikasiOrtu from "./pages/OrangTua/Notifikasi";
const RequireAuth = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // atau spinner

  if (!user) return <Navigate to="/" replace />;

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
const App = () => {
  const myRouter = createBrowserRouter([
    //Guest
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },

    //kader posyandu
    {
      path: "/kader",
      element: (
        <RequireAuth role="kader">
          <Outlet />
        </RequireAuth>
      ),
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "manajemenbalita", element: <ManajemenBalita /> },
        { path: "createmanajemenbalita", element: <CreateForm /> },
        { path: "detailmanajemenbalita", element: <DetailFormBalita /> },
        { path: "updatemanajemenbalita", element: <UpdateFormBalita /> },
        { path: "manajemenpenimbangan", element: <Penimbangan /> },
        { path: "createpenimbangan", element: <CreatePenimbangan /> },
        { path: "detailpenimbangan", element: <DetailPenimbangan /> },
        { path: "updatepenimbangan", element: <UpdatePenimbangan /> },
        { path: "deteksidini", element: <DeteksiStunting /> },
        { path: "riwayat", element: <Riwayat /> },
        { path: "laporan", element: <Laporan /> },
        { path: "notif", element: <Notifikasi /> },
      ],
    },

    //orang tua
    {
      path: "/orangtua",
      element: (
        <RequireAuth role="orangtua">
          <Outlet />
        </RequireAuth>
      ),
      children: [
        { path: "dashboard", element: <DashboardOrangTua /> },
        { path: "edukasi", element: <EdukasiKesehatanAnak /> },
        { path: "riwayat", element: <RiwayatPemeriksaan /> },
        { path: "deteksi", element: <Deteksi /> },
        { path: "notifikasi", element: <NotifikasiOrtu /> },
      ],
    },
  ]);

  //admin

  return (
    <>
      <RouterProvider router={myRouter} />
    </>
  );
};

export default App;
