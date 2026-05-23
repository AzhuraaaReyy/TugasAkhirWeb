import { useState, useMemo } from "react";
import FormInput from "@/components/Fragments/Form/FormInput";
import FormSelect from "@/components/Fragments/Form/FormSelect";
import FormTextarea from "@/components/Fragments/Form/FormTextarea";

export default function FormPencatatan({
  form,
  handleChange,
  handleSubmit,
  setForm,
  posyandus,
  handleBack,
  errors,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const resetStepTwo = () => {
    setForm((prev) => ({
      ...prev,
      user_id: "",
    }));
  };
  /* ================= REQUIRED FIELDS ================= */
  const requiredFields = [
    "name",
    "jk",
    "tgl_lahir",
    "tmp_lahir",
    "posyandu_id",
  ];

  /* ================= VALIDASI STEP 1 ================= */
  const isStepOneValid = useMemo(() => {
    return requiredFields.every(
      (field) => form[field]?.toString().trim() !== "",
    );
  }, [form]);

  /* ================= NEXT STEP ================= */
  const handleNextStep = () => {
    if (!isStepOneValid) {
      setError("Lengkapi seluruh data identitas balita terlebih dahulu.");
      return;
    }

    setError("");
    setCurrentStep(2);
  };

  /* ================= PREV STEP ================= */
  const handlePrevStep = () => {
    if (currentStep === 1) {
      handleBack();
      return;
    }
    resetStepTwo();
    setCurrentStep(1);
  };
  return (
    <div className="min-h-screen bg-slate-100 rounded-3xl p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
        {/* ================= HEADER ================= */}
        <div className="border-b border-gray-200 pb-5 mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Form Pencatatan Pemeriksaan Balita
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Lengkapi data identitas balita dan orang tua untuk kebutuhan
            monitoring pertumbuhan serta pemeriksaan kesehatan.
          </p>
        </div>

        {/* ================= STEP INDICATOR ================= */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-4">
            {/* STEP 1 */}
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition
                ${
                  currentStep >= 1
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                1
              </div>

              <p className="text-sm font-semibold text-gray-700">
                Identitas Data Balita
              </p>
            </div>

            <div className="w-16 h-[2px] bg-gray-300"></div>

            {/* STEP 2 */}
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition
                ${
                  currentStep >= 2
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>

              <p className="text-sm font-semibold text-gray-700">
                Identitas Data Orang Tua / Wali
              </p>
            </div>
          </div>
        </div>

        {/* ================= ERROR MESSAGE ================= */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* STEP 1 - IDENTITAS BALITA */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Identitas Balita
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Isi data dasar balita secara lengkap dan sesuai.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FormInput
                    label="Nama Lengkap Balita"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Contoh: Aisyah Putri"
                    required
                  />
                  {errors?.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.name[0]}
                    </p>
                  )}
                </div>
                <div>
                  <FormSelect
                    label="Jenis Kelamin"
                    name="jk"
                    value={form.jk}
                    onChange={handleChange}
                    required
                    options={[
                      { label: "Laki-Laki", value: "L" },
                      { label: "Perempuan", value: "P" },
                    ]}
                  />
                  {errors?.jk && (
                    <p className="text-sm text-red-500 mt-1">{errors.jk[0]}</p>
                  )}
                </div>
                <div>
                  <FormInput
                    label="Tanggal Lahir"
                    name="tgl_lahir"
                    type="date"
                    value={form.tgl_lahir}
                    onChange={handleChange}
                    required
                  />
                  {errors?.tgl_lahir && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.tgl_lahir[0]}
                    </p>
                  )}
                </div>
                <div>
                  <FormInput
                    label="Tempat Lahir"
                    name="tmp_lahir"
                    value={form.tmp_lahir}
                    onChange={handleChange}
                    placeholder="Contoh: Semarang"
                    required
                  />
                  {errors?.tmp_lahir && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.tmp_lahir[0]}
                    </p>
                  )}
                </div>
                <div>
                  <FormSelect
                    label="Posyandu"
                    name="posyandu_id"
                    value={form.posyandu_id}
                    onChange={handleChange}
                    required
                    options={posyandus.map((item) => ({
                      label: item.nama_posyandu,
                      value: item.id,
                    }))}
                  />
                  {errors?.posyandu_id && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.posyandu_id[0]}
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-emerald-700 mb-2">
                  Informasi Pencatatan
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Data balita dan orang tua yang telah dicatat akan digunakan
                  untuk proses monitoring pertumbuhan, pemeriksaan kesehatan,
                  serta akses riwayat pemeriksaan oleh wali terkait.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2 - DATA ORANG TUA */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Identitas Orang Tua / Wali
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Pilih data orang tua atau wali yang terhubung dengan balita.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                <div>
                  <FormInput
                    label="Nama Orang Tua / Wali"
                    name="nama_orangtua"
                    value={form.nama_orangtua}
                    onChange={handleChange}
                    placeholder="Masukkan nama orang tua"
                    required
                  />
                  {errors?.nama_orangtua && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.nama_orangtua[0]}
                    </p>
                  )}
                </div>
                <div>
                  <FormInput
                    label="Nomor WhatsApp"
                    name="no_telp"
                    value={form.no_telp}
                    onChange={handleChange}
                    placeholder="Contoh: 08123456789"
                    required
                  />
                  {errors?.no_telp && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.no_telp[0]}
                    </p>
                  )}
                </div>
                <div>
                  <FormTextarea
                    label="Alamat"
                    name="alamat"
                    value={form.alamat}
                    onChange={handleChange}
                    placeholder="Masukkan alamat lengkap"
                    required
                  />
                  {errors?.alamat && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.alamat[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* INFORMASI */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-emerald-700 mb-2">
                  Informasi Pencatatan
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Data balita dan orang tua yang telah dicatat akan digunakan
                  untuk proses monitoring pertumbuhan, pemeriksaan kesehatan,
                  serta akses riwayat pemeriksaan oleh wali terkait.
                </p>
              </div>
            </div>
          )}

          {/* ================= ACTION BUTTON ================= */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              {currentStep === 1 ? "Kembali" : "Sebelumnya"}
            </button>

            {currentStep < 2 ? (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!isStepOneValid}
                className={`px-5 py-2 rounded-xl text-white transition
    ${
      isStepOneValid
        ? "bg-emerald-600 hover:bg-emerald-700"
        : "bg-gray-300 cursor-not-allowed"
    }`}
              >
                Lanjutkan
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Simpan Data
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
