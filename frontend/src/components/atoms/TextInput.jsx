const ACCENT_CLASSES = {
  blue: 'focus:ring-blue-400 focus:border-blue-400 border-blue-200',
  purple: 'focus:ring-purple-400 focus:border-purple-400 border-purple-200',
  teal: 'focus:ring-teal-400 focus:border-teal-400 border-teal-200',
  orange: 'focus:ring-orange-400 focus:border-orange-400 border-orange-200',
}

export function TextInput({ id, type = 'text', value, onChange, placeholder, min, disabled = false, accent = 'orange' }) {
  const accentStyle = ACCENT_CLASSES[accent] || ACCENT_CLASSES.orange

  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      disabled={disabled}
      className={`w-full px-3 py-2 border rounded-md bg-white/80 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${accentStyle}`}
    />
  )
}

