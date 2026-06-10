import { LineChart } from "@mui/x-charts/LineChart";
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "@/services/api";
import { OrbitProgress } from "react-loading-indicators";

const fmt = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

const GrowthChart = ({
  balitaId: propBalitaId,
  endpoint,
  namaBalita: propNama,
}) => {
  const params = useParams();
  const balitaId = propBalitaId ?? params.balitaId ?? params.id;

  const { pathname } = useLocation();
  const isOrtu = pathname.startsWith("/orangtua");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ukur lebar kartu agar chart memenuhi lebar kontainer (bukan default 500px).
  const cardRef = useRef(null);
  const [innerW, setInnerW] = useState(0);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setInnerW(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!balitaId && !endpoint) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const url =
          endpoint ??
          (isOrtu ? `/grafik-ortu/${balitaId}` : `/grafik/${balitaId}`);
        const res = await api.get(url);
        const rows = Array.isArray(res.data)
          ? res.data
          : (res.data?.data ?? []);
        setData(rows);
      } catch (err) {
        console.error("Gagal memuat grafik pertumbuhan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [balitaId, endpoint, isOrtu]);

  const dataset = data.map((d) => ({
    ...d,
    label:
      d.bulan ||
      d.tgl_label ||
      (d.tgl_deteksi
        ? new Date(d.tgl_deteksi).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          })
        : "-"),
  }));

  // Bila riwayat banyak, chart melebar & bisa digeser; selain itu mengikuti
  // lebar kartu hasil pengukuran (innerW).
  const lebarPerTitik = 90;
  const banyakData = dataset.length > 8;
  const lebarChart = banyakData
    ? dataset.length * lebarPerTitik
    : innerW || undefined;

  const beratVals = dataset
    .map((d) => Number(d.berat))
    .filter((n) => !isNaN(n));
  const tinggiVals = dataset
    .map((d) => Number(d.tinggi))
    .filter((n) => !isNaN(n));
  const maxBerat = beratVals.length ? Math.max(...beratVals) : 0;
  const maxTinggi = tinggiVals.length ? Math.max(...tinggiVals) : 0;
  const beratMax = Math.ceil(maxBerat * 1.25) + 1;
  const tinggiMax = Math.ceil(maxTinggi * 1.1) + 5;

  const tampilArea = dataset.length > 1;

  return (
    <div className="w-full bg-white rounded-3xl">
      <div
        ref={cardRef}
        className="rounded-3xl p-6 bg-white border-2 border-gray-200"
      >
        <div className="mb-4">
          <h3 className="text-lg font-bold text-stone-800">
            Grafik Pertumbuhan
          </h3>
          <p className="text-sm text-stone-500">
            Riwayat tinggi &amp; berat badan
            {propNama ? ` — ${propNama}` : ""}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[360px]">
            <OrbitProgress
              dense
              color="#32cd32"
              size="medium"
              text=""
              textColor=""
            />
          </div>
        ) : dataset.length === 0 ? (
          <div className="flex justify-center items-center h-[360px] text-sm text-stone-400">
            Belum ada data pertumbuhan untuk anak ini.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <div style={banyakData ? { minWidth: lebarChart } : undefined}>
              <LineChart
                height={360}
                width={lebarChart}
                dataset={dataset}
                xAxis={[
                  {
                    scaleType: "point",
                    dataKey: "label",
                    tickLabelStyle: { fill: "#64748b", fontSize: 11 },
                  },
                ]}
                yAxis={[
                  {
                    id: "berat",
                    label: "Berat (kg)",
                    min: 0,
                    max: beratMax,
                    tickLabelStyle: { fill: "#64748b", fontSize: 11 },
                    labelStyle: {
                      fill: "#2563eb",
                      fontSize: 12,
                      fontWeight: 600,
                    },
                  },
                  {
                    id: "tinggi",
                    position: "right",
                    label: "Tinggi (cm)",
                    min: 0,
                    max: tinggiMax,
                    tickLabelStyle: { fill: "#64748b", fontSize: 11 },
                    labelStyle: {
                      fill: "#16a34a",
                      fontSize: 12,
                      fontWeight: 600,
                    },
                  },
                ]}
                series={[
                  {
                    dataKey: "tinggi",
                    label: "Tinggi Badan",
                    yAxisId: "tinggi",
                    color: "#16a34a",
                    curve: "natural",
                    area: tampilArea,
                    showMark: true,
                    valueFormatter: (v) =>
                      v == null ? "-" : `${fmt.format(v)} cm`,
                  },
                  {
                    dataKey: "berat",
                    label: "Berat Badan",
                    yAxisId: "berat",
                    color: "#3b82f6",
                    curve: "natural",
                    area: tampilArea,
                    showMark: true,
                    valueFormatter: (v) =>
                      v == null ? "-" : `${fmt.format(v)} kg`,
                  },
                ]}
                grid={{ horizontal: true, vertical: false }}
                margin={{ top: 24, bottom: 40, left: 60, right: 64 }}
                slotProps={{
                  legend: {
                    direction: "row",
                    position: { vertical: "top", horizontal: "right" },
                    labelStyle: {
                      fill: "#334155",
                      fontSize: 12,
                      fontWeight: 500,
                    },
                  },
                  tooltip: { trigger: "axis" },
                }}
                sx={{
                  "& .MuiMarkElement-root": { strokeWidth: 2, r: 5 },
                  "& .MuiChartsAxis-line": { stroke: "#e2e8f0" },
                  "& .MuiChartsGrid-line": { stroke: "#f1f5f9" },
                  "& .MuiLineElement-root": { strokeWidth: 3 },
                  "& .MuiLineElement-root:nth-of-type(1)": {
                    filter: "drop-shadow(0px 2px 6px rgba(22,163,74,0.35))",
                  },
                  "& .MuiLineElement-root:nth-of-type(2)": {
                    filter: "drop-shadow(0px 2px 6px rgba(59,130,246,0.35))",
                  },
                  "& .MuiAreaElement-root:nth-of-type(1)": {
                    fill: "url(#gradTinggi)",
                  },
                  "& .MuiAreaElement-root:nth-of-type(2)": {
                    fill: "url(#gradBerat)",
                  },
                }}
              >
                <defs>
                  <linearGradient id="gradTinggi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(22,163,74,0.38)" />
                    <stop offset="100%" stopColor="rgba(22,163,74,0)" />
                  </linearGradient>
                  <linearGradient id="gradBerat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.38)" />
                    <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                  </linearGradient>
                </defs>
              </LineChart>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrowthChart;
