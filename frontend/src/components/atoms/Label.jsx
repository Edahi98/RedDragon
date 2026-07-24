export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-amber-900 mb-1">
      {children}
    </label>
  )
}
