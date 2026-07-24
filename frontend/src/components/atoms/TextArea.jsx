export function TextArea({ id, value, onChange, rows = 10 }) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      rows={rows}
      spellCheck={false}
      className="w-full px-3 py-2 font-mono text-sm border border-orange-200 rounded-md bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-400"
    />
  )
}
