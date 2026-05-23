export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  disabled,
  className = "",
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full h-12 border border-gray-300 rounded-xl px-4 text-sm outline-none ${className}`}
      >
        <option value="">Pilih {label}</option>

        {options.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
