const Button = ({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  ...props
}) => {
  const baseStyle =
    "h-12 w-full rounded-full text-sm font-semibold transition duration-200";

  const variants = {
    primary: "bg-emerald-400 text-white hover:bg-emerald-600",
    google:
      "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2",
  };

  const disabledStyle = "bg-gray-300 text-gray-500 ";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyle} ${disabled ? disabledStyle : variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
