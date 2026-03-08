import { useState } from "react";
const FormTestimoni = ({ onSubmit }) => {
  const [form, setForm] = useState({
    nama: "",
    peran: "",
    komentar: "",
    rating: 5,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTestimoni = {
      ...form,
      foto: `https://i.pravatar.cc/150?u=${form.nama}`,
    };

    onSubmit(newTestimoni);

    setForm({
      nama: "",
      peran: "",
      komentar: "",
      rating: 5,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mt-16 max-w-xl mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-center">
        Kirim Ulasan Anda
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nama"
          required
          className="w-full border rounded-lg p-3"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
        />

        <input
          type="text"
          placeholder="Peran (Orang Tua / Kader Posyandu)"
          className="w-full border rounded-lg p-3"
          value={form.peran}
          onChange={(e) => setForm({ ...form, peran: e.target.value })}
        />

        <textarea
          placeholder="Tulis ulasan Anda..."
          required
          className="w-full border rounded-lg p-3"
          value={form.komentar}
          onChange={(e) => setForm({ ...form, komentar: e.target.value })}
        />

        <select
          className="w-full border rounded-lg p-3"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
        >
          <option value={5}>⭐⭐⭐⭐⭐</option>
          <option value={4}>⭐⭐⭐⭐</option>
          <option value={3}>⭐⭐⭐</option>
          <option value={2}>⭐⭐</option>
          <option value={1}>⭐</option>
        </select>

        <button
          type="submit"
          className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600"
        >
          Kirim Ulasan
        </button>
      </form>
    </div>
  );
};
export default FormTestimoni;
