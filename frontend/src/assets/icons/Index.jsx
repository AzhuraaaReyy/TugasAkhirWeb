import PropTypes from "prop-types";

const IconWrapper = ({ children }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);

const DashboardIcon = () => (
  <IconWrapper>
    <g
      stroke="#00bd16"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </g>
  </IconWrapper>
);
const ManajemenIcon = () => (
  <IconWrapper>
    <g
      stroke="#00bd16"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-folder-code-icon lucide-folder-code"
    >
      <path d="M10 10.5 8 13l2 2.5" />
      <path d="m14 10.5 2 2.5-2 2.5" />
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
    </g>
  </IconWrapper>
);
const InputPenimbanganIcon = () => (
  <IconWrapper>
    <g
      stroke="#00bd16"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-file-input-icon lucide-file-input"
    >
      <path d="M4 11V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
      <path d="M2 15h10" />
      <path d="m9 18 3-3-3-3" />
    </g>
  </IconWrapper>
);
const DeteksiDiniIcon = () => (
  <IconWrapper>
    <g
      stroke="#00bd16"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-shield-alert-icon lucide-shield-alert"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </g>
  </IconWrapper>
);
const RiwayatIcon = () => (
  <IconWrapper>
    <g
      stroke="#00bd16"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-history-icon lucide-history"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </g>
  </IconWrapper>
);
const GrafikIcon = () => (
  <IconWrapper>
    <g
      stroke="#00bd16"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-chart-spline-icon lucide-chart-spline"
    >
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7" />
    </g>
  </IconWrapper>
);
const ManajemenStatusRisikoIcon = () => (
  <IconWrapper>
    <g
      stroke="#00bd16"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-chart-spline-icon lucide-chart-spline"
    >
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7" />
    </g>
  </IconWrapper>
);
const LaporanIcon = () => (
  <IconWrapper>
    <g
      stroke="#00bd16"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-file-code-icon lucide-file-code"
    >
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
      <path d="M10 12.5 8 15l2 2.5" />
      <path d="m14 12.5 2 2.5-2 2.5" />
    </g>
  </IconWrapper>
);
const NotificationIcon = () => (
  <IconWrapper>
    <g
      stroke="#00bd16"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-bell-icon lucide-bell"
    >
      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
    </g>
  </IconWrapper>
);
const WaktuIcon = () => (
  <IconWrapper>
    <g
      stroke="#868686"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      classname="lucide lucide-history-icon lucide-history"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </g>
  </IconWrapper>
);

export const Icon = {
  Dashboard: DashboardIcon,
  Manajemen: ManajemenIcon,
  InputPenimbangan: InputPenimbanganIcon,
  DeteksiDini: DeteksiDiniIcon,
  Riwayat: RiwayatIcon,
  Grafik: GrafikIcon,
  ManajemenStatusRisiko: ManajemenStatusRisikoIcon,
  Laporan: LaporanIcon,
  Notification: NotificationIcon,
  Waktu: WaktuIcon,
};
IconWrapper.propTypes = {
  children: PropTypes.node.isRequired, // Validasi children sebagai node
};
