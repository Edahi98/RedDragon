const ACCENT_TITLE_CLASSES = {
  blue: 'text-blue-900',
  purple: 'text-purple-900',
  teal: 'text-teal-900',
  amber: 'text-amber-900',
}

export function SectionTitle({ children, icon, accent = 'amber' }) {
  const textColorClass = ACCENT_TITLE_CLASSES[accent] || ACCENT_TITLE_CLASSES.amber

  return (
    <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${textColorClass}`}>
      {icon && <span className="text-sm normal-case select-none">{icon}</span>}
      <span>{children}</span>
    </h3>
  )
}

