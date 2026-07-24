export function Select({ id, value, onChange, options }) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-orange-200 rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-400"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
