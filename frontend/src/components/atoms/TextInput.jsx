export function TextInput({ id, type = 'text', value, onChange, placeholder, min, disabled = false }) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      disabled={disabled}
      className="w-full px-3 py-2 border border-orange-200 rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  )
}
