const ACCENT_CLASSES = {
  blue: 'file:from-blue-500 file:to-cyan-500 hover:file:from-blue-600 hover:file:to-cyan-600 border-blue-200 focus:ring-blue-400',
  purple: 'file:from-purple-500 file:to-pink-500 hover:file:from-purple-600 hover:file:to-pink-600 border-purple-200 focus:ring-purple-400',
  teal: 'file:from-teal-500 file:to-emerald-500 hover:file:from-teal-600 hover:file:to-emerald-600 border-teal-200 focus:ring-teal-400',
  orange: 'file:from-orange-500 file:to-amber-400 hover:file:from-orange-600 hover:file:to-amber-500 border-orange-200 focus:ring-orange-400',
}

export function FileInput({ id, accept, onChange, accent = 'orange' }) {
  const accentStyle = ACCENT_CLASSES[accent] || ACCENT_CLASSES.orange

  return (
    <input
      id={id}
      type="file"
      accept={accept}
      onChange={onChange}
      className={`w-full text-sm text-slate-700 file:mr-3 file:px-4 file:py-2 file:rounded-md file:border-0 file:text-white file:font-medium file:cursor-pointer border rounded-md bg-white/80 focus:outline-none focus:ring-2 ${accentStyle}`}
    />
  )
}

