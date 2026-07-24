const VARIANT_CLASSES = {
  primary:
    'bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-md shadow-orange-500/30 hover:from-orange-600 hover:to-amber-500',
  secondary: 'bg-amber-100 text-amber-900 hover:bg-amber-200',
}

export function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </button>
  )
}
