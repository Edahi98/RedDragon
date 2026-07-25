const ACCENT_CLASSES = {
  blue: 'border-blue-300 text-blue-600 focus:ring-blue-400 accent-blue-500',
  purple: 'border-purple-300 text-purple-600 focus:ring-purple-400 accent-purple-500',
  teal: 'border-teal-300 text-teal-600 focus:ring-teal-400 accent-teal-500',
  orange: 'border-orange-300 text-orange-600 focus:ring-orange-400 accent-orange-500',
}

export function Checkbox({ id, checked, onChange, disabled = false, accent = 'orange' }) {
  const accentStyle = ACCENT_CLASSES[accent] || ACCENT_CLASSES.orange

  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={`h-4 w-4 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${accentStyle}`}
    />
  )
}

