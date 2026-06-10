import {
  CalendarCheck,
  Scale,
  Ruler,
  CheckCircle2,
  Calculator,
} from "lucide-react";

export default function CardStatusPertumbuhanOrtu({ child }) {
  const logs = [...child.logs].sort((a, b) => a.month - b.month);
  const latestLog = logs[logs.length - 1];
  const previousLog = logs.length > 1 ? logs[logs.length - 2] : null;

  const totalWeighings = logs.length;
  const currentWeight = latestLog ? latestLog.weight : 0;
  const currentHeight = latestLog ? latestLog.height : 0;

  // Compute status indicators
  // For standard: Budi (12m, 9.8kg) -> Normal, Siti (8m, 6.1kg) -> Di bawah standard, Rian (18m, 12.1kg) -> Optimal
  let weightStatus = "Normal";
  let weightStatusColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
  let heightStatus = "Normal";
  let heightStatusColor = "bg-emerald-50 text-emerald-800 border-emerald-200";

  if (child.statusColor === "yellow") {
    weightStatus = "Kurang (Bawah garis gizi)";
    weightStatusColor = "bg-amber-50 text-amber-800 border-amber-200";
    heightStatus = "Agak Pendek";
    heightStatusColor = "bg-amber-55 text-amber-850 border-amber-200";
  } else if (child.statusColor === "red") {
    weightStatus = "Sangat Kurang";
    weightStatusColor = "bg-red-50 text-red-800 border-red-200";
    heightStatus = "Stunting Alert";
    heightStatusColor = "bg-red-50 text-red-800 border-red-250";
  } else if (child.statusColor === "emerald") {
    weightStatus = "Sangat Optimal";
    weightStatusColor = "bg-indigo-50 text-[#25352c] border-indigo-200";
    heightStatus = "Tinggi & Sehat";
    heightStatusColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
  }

  // Weight gain calculation
  const weightGain = previousLog ? currentWeight - previousLog.weight : 0.4;
  const heightGain = previousLog ? currentHeight - previousLog.height : 1.2;

  return (
    <div
      id="growth-status-card"
      className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/60 flex flex-col justify-between h-full group hover:shadow-md transition-all duration-300"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-stone-900 text-lg">
            Status Pertumbuhan Saat Ini
          </h3>
          <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </span>
        </div>

        {/* Dynamic Multi-Metrics */}
        <div className="space-y-4">
          {/* TOTAL WEIGHINGS */}
          <div className="flex items-center justify-between p-3.5 bg-[#fcfcf9] rounded-2xl border border-stone-100 hover:border-stone-200 transition-all shadow-inner">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-50 text-sky-800 rounded-xl border border-sky-100">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-stone-400 block tracking-widest font-mono uppercase leading-none">
                  FREKUENSI MONITORING
                </span>
                <span className="font-display font-bold text-stone-850 text-sm mt-1 block">
                  Total Penimbangan
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-display font-extrabold text-lg text-stone-800">
                {totalWeighings}{" "}
                <span className="text-xs font-semibold text-stone-500">
                  kali
                </span>
              </span>
              <span className="text-[9px] text-[#8fa89b] block bg-[#25352c]/5 px-1.5 py-0.5 rounded font-bold font-mono uppercase mt-0.5">
                Rutin Bulanan
              </span>
            </div>
          </div>

          {/* WEIGHT METRIC */}
          <div className="flex items-center justify-between p-3.5 bg-[#fcfcf9] rounded-2xl border border-stone-100 hover:border-stone-200 transition-all shadow-inner">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-stone-400 block tracking-widest font-mono uppercase leading-none">
                  BERAT BADAN SEKARANG
                </span>
                <span className="font-display font-bold text-stone-850 text-sm mt-1 block">
                  Berat Badan Aktif
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display font-extrabold text-lg text-stone-800">
                {currentWeight.toFixed(1)}{" "}
                <span className="text-xs font-semibold text-stone-500">kg</span>
              </div>
              <span
                className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${weightStatusColor} mt-0.5`}
              >
                {weightStatus}
              </span>
            </div>
          </div>

          {/* HEIGHT METRIC */}
          <div className="flex items-center justify-between p-3.5 bg-[#fcfcf9] rounded-2xl border border-stone-100 hover:border-stone-200 transition-all shadow-inner">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-100">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-stone-400 block tracking-widest font-mono uppercase leading-none">
                  TINGGI/PANJANG BADAN
                </span>
                <span className="font-display font-bold text-stone-850 text-sm mt-1 block">
                  Tinggi Badan
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display font-extrabold text-lg text-stone-800">
                {currentHeight.toFixed(0)}{" "}
                <span className="text-xs font-semibold text-stone-500">cm</span>
              </div>
              <span
                className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${heightStatusColor} mt-0.5`}
              >
                {heightStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly delta trends */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 bg-[#fbfbf9] p-3 rounded-xl border border-stone-50">
        <div className="flex items-center gap-1">
          <Calculator className="w-3.5 h-3.5 text-stone-400" />
          <span>Pertumbuhan dari penimbangan sebelumnya:</span>
        </div>
        <div className="font-semibold text-[#8fa89b]">
          BB: <span className="font-mono">+{weightGain.toFixed(1)}kg</span> |
          PB: <span className="font-mono">+{heightGain.toFixed(0)}cm</span>
        </div>
      </div>
    </div>
  );
}
