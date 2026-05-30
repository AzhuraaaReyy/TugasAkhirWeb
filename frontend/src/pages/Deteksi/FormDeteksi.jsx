import FormInput from "@/components/Fragments/Form/FormInput";
import FormSelect from "@/components/Fragments/Form/FormSelect";
import Select from "react-select";

export default function FormDeteksi({
  form,
  handleChange,
  handleSubmit,
  handleBack,
  balitas,
  handleSelectBalita,
}) {
  const OPTION_HEIGHT = 44;
  const MAX_VISIBLE_OPTIONS = 3;
  return (
    <div className="w-full lg:w-7/12 flex">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm  w-full h-full">
        {/* HEADER */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Deteksi Status Gizi Balita
              </h2>

              <p className="text-sm text-gray-500 mt-2 max-w-2xl">
                Masukkan data pemeriksaan balita untuk mengetahui hasil analisis
                status gizi berdasarkan indikator WHO.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="p-8">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* SELECT BALITA */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Balita
              </label>

              <Select
                options={balitas.map((item) => ({
                  value: item.id,
                  label: `${item.name} - ${item.orangtua || "-"}`,
                }))}
                value={
                  form.balita_id
                    ? {
                        value: form.balita_id,
                        label: `${form.name} - ${form.nama_orangtua || "-"}`,
                      }
                    : null
                }
                onChange={(selected) =>
                  handleSelectBalita({
                    target: {
                      name: "balita_id",
                      value: selected?.value || "",
                    },
                  })
                }
                placeholder="Cari dan pilih balita..."
                isSearchable
                closeMenuOnSelect={true}
                menuShouldScrollIntoView={false}
                maxMenuHeight={OPTION_HEIGHT * MAX_VISIBLE_OPTIONS}
                className="text-sm"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: "48px",
                    borderRadius: "14px",
                    borderColor: state.isFocused ? "#10b981" : "#d1d5db",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "#10b981",
                    },
                  }),

                  menu: (base) => ({
                    ...base,
                    borderRadius: "14px",
                    overflow: "hidden",
                    zIndex: 9999,
                  }),

                  option: (base, state) => ({
                    ...base,
                    height: OPTION_HEIGHT,
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: state.isFocused ? "#ecfdf5" : "white",
                    color: "#111827",
                    cursor: "pointer",
                  }),
                }}
              />
            </div>

            {/* FORM MUNCUL SETELAH PILIH BALITA */}
            {form.balita_id && (
              <>
                <FormInput
                  label="Nama Balita"
                  name="name"
                  value={form.name}
                  disabled
                  className="bg-gray-100"
                />

                <FormSelect
                  label="Metode Pemeriksaan"
                  name="metode"
                  value={form.metode}
                  onChange={handleChange}
                  required
                  options={[
                    {
                      label: "Stunting (TB/U)",
                      value: "stunting",
                    },
                    {
                      label: "Wasting (BB/TB)",
                      value: "wasting",
                    },
                    {
                      label: "Underweight (BB/U)",
                      value: "underweight",
                    },
                  ]}
                />

                <FormSelect
                  label="Jenis Kelamin"
                  name="jk"
                  value={form.jk}
                  disabled
                  options={[
                    { label: "Laki-Laki", value: "L" },
                    { label: "Perempuan", value: "P" },
                  ]}
                  className="bg-gray-100"
                />

                <FormInput
                  label="Tanggal Lahir"
                  type="date"
                  name="tgl_lahir"
                  value={form.tgl_lahir || ""}
                  disabled
                  className="bg-gray-100"
                />

                <FormInput
                  label="Tanggal Pemeriksaan"
                  type="date"
                  name="tgl_deteksi"
                  value={form.tgl_deteksi}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Umur (bulan)"
                  type="number"
                  name="umur"
                  value={Math.floor(form.umur || 0)}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Tinggi Badan (cm)"
                  type="number"
                  name="tinggi"
                  value={form.tinggi}
                  onChange={handleChange}
                  placeholder="Masukkan tinggi badan"
                  required
                />

                <FormInput
                  label="Berat Badan (kg)"
                  type="number"
                  name="berat"
                  value={form.berat}
                  onChange={handleChange}
                  placeholder="Masukkan berat badan"
                  required
                />

                <div className="md:col-span-2 pt-3">
                  <button className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition">
                    Proses Deteksi
                  </button>
                </div>
              </>
            )}
          </form>

          {/* BUTTON KEMBALI */}
          <button
            onClick={handleBack}
            className="mt-2 w-full h-12 rounded-xl bg-gray-100 border border-gray-300 text-sm hover:bg-gray-300 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
