import { Icon } from "../../assets/icons/Index";

export const kaderMenu = [
  {
    id: "dashboard",
    link: "/kader/dashboard",
    icon: <Icon.Dashboard />,
    label: "Dashboard",
  },
  {
    id: "deteksidini",
    link: "/kader/deteksidini",
    icon: <Icon.DeteksiDini />,
    label: "Catat&Deteksi",
  },
  {
    id: "riwayat",
    link: "/kader/riwayat",
    icon: <Icon.Riwayat />,
    label: "Riwayat Deteksi",
  },

  {
    id: "laporan",
    link: "/kader/laporan",
    icon: <Icon.Laporan />,
    label: "Laporan",
  },
  {
    id: "notif",
    link: "/kader/notif",
    icon: <Icon.Notification />,
    label: "Manajemen Notifikasi",
  },
];

export const orangTuaMenu = [
  {
    id: "dashboardortu",
    link: "/orangtua/dashboard",
    icon: <Icon.Dashboard />,
    label: "Dashboard",
  },
  {
    id: "riwayatortu",
    link: "/orangtua/riwayat",
    icon: <Icon.Dashboard />,
    label: "Riwayat Pemeriksaan",
  },
  {
    id: "edukasiortu",
    link: "/orangtua/edukasi",
    icon: <Icon.Edukasi />,
    label: "Edukasi",
  },
];
