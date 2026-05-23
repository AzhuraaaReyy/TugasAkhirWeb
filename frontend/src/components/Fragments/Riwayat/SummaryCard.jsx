export default function SummaryCard() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-800">
        Ringkasan Tumbuh Kembang
      </h3>

      <div className="mt-6 space-y-5">
        <SummaryItem title="Berat Badan" />
        <SummaryItem title="Tinggi Badan" />
        <SummaryItem title="Lingkar Kepala" />
      </div>
    </div>
  );
}

function SummaryItem({ title }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{title}</span>

      <div className="flex items-center gap-2 text-emerald-600 font-semibold">
        Naik
        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
          ↑
        </div>
      </div>
    </div>
  );
}