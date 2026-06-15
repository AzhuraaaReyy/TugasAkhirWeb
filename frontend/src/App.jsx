import {
  Outlet,
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/useAuth";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthCallback from "./pages/Callback";
import Chatbot from "./pages/Chatbot";
import Dashboard from "./pages/Kader/Dashboard";
import DeteksiDini from "./pages/Kader/Deteksi";
import Laporan from "./pages/Kader/Laporan";
import Notifikasi from "./pages/Kader/Notifikasi";
import DetailDeteksi from "./pages/Kader/DetailDeteksi";
import LihatRiwayat from "./pages/Kader/LihatRiwayat";
import LihatMonitoring from "./pages/Kader/LihatMonitoring";
import TrenMonitoring from "./components/Fragments/Riwayat/TrenMonitoring";
import DashboardOrtu from "./pages/OrangTua/Dashboard";
import EdukasiStunting from "./pages/OrangTua/Edukasi";
import RiwayatOrtu from "./pages/OrangTua/Riwayat";
import LengkapiNoTelp from "./pages/Lengkapinotelp";
import RiwayatdanGrafik from "./pages/Kader/RiwayatGrafik";
import KeteranganWarna from "./components/Fragments/Monitoring/CardLegend";
import DetailFormBalita from "./pages/Admin/ManajemenBalita/Detail";
import UpdateFormBalita from "./pages/Admin/ManajemenBalita/Update";
import DetailPenimbangan from "./pages/Admin/ManajemenPenimbangan/Detail";
import UpdatePenimbangan from "./pages/Admin/ManajemenPenimbangan/Update";
const RequireAuth = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/" replace />;

  if (role && user.role !== role) {
    // arahkan ke beranda sesuai peran, JANGAN ke /login
    const beranda =
      user.role === "kader"
        ? "/kader/dashboard"
        : user.role === "orangtua"
          ? "/orangtua/dashboard"
          : "/";
    return <Navigate to={beranda} replace />;
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
      path: "/warna",
      element: <KeteranganWarna />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    { path: "/auth/callback", element: <AuthCallback /> },
    {
      path: "chatbot/:id",
      element: (
        <RequireAuth>
          <Chatbot />
        </RequireAuth>
      ),
    },
    {
      path: "chatbot/:id/snapshot/:deteksiId",
      element: (
        <RequireAuth>
          <Chatbot />
        </RequireAuth>
      ),
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
        { path: "deteksidini", element: <DeteksiDini /> },
        { path: "laporan", element: <Laporan /> },
        { path: "notif", element: <Notifikasi /> },
        { path: "detaildeteksi/:id", element: <DetailDeteksi /> },
        { path: "lihatriwayat/:id", element: <LihatRiwayat /> },
        { path: "lihatmonitoring/:id", element: <LihatMonitoring /> },
        { path: "riwayat", element: <RiwayatdanGrafik /> },
        { path: "detailmanajemenbalita/:id", element: <DetailFormBalita /> },
        { path: "updatemanajemenbalita/:id", element: <UpdateFormBalita /> },
        { path: "detailpenimbangan/:id", element: <DetailPenimbangan /> },
        { path: "updatepenimbangan/:id", element: <UpdatePenimbangan /> },
        {
          path: "monitoring/:balitaId/:deteksiId",
          element: <TrenMonitoring />,
        },
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
        { path: "dashboard/:id?", element: <DashboardOrtu /> },
        { path: "edukasi", element: <EdukasiStunting /> },
        { path: "riwayat", element: <RiwayatOrtu /> },
        { path: "lengkapinotelp", element: <LengkapiNoTelp /> },
        { path: "riwayat/:id", element: <RiwayatOrtu /> },
        {
          path: "monitoring/:balitaId/:deteksiId",
          element: <TrenMonitoring />,
        },
      ],
    },

    //admin
  ]);

  return (
    <>
      <RouterProvider router={myRouter} />
    </>
  );
};

export default App;
