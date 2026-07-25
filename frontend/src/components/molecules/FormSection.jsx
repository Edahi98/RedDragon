import { SectionTitle } from '../atoms/SectionTitle'

const ACCENT_CONTAINER_CLASSES = {
  blue: 'bg-blue-50/40 border-blue-200 border-l-4 border-l-blue-500',
  purple: 'bg-purple-50/40 border-purple-200 border-l-4 border-l-purple-500',
  teal: 'bg-teal-50/40 border-teal-200 border-l-4 border-l-teal-500',
  amber: 'bg-amber-50/40 border-amber-200 border-l-4 border-l-amber-500',
}

export function FormSection({ title, icon, accent = 'amber', subtitle, children }) {
  const containerClass = ACCENT_CONTAINER_CLASSES[accent] || ACCENT_CONTAINER_CLASSES.amber

  return (
    <div className={`flex flex-col gap-3.5 p-4 rounded-xl border transition-all ${containerClass}`}>
      {title && (
        <div>
          <SectionTitle icon={icon} accent={accent}>
            {title}
          </SectionTitle>
          {subtitle && (
            <p className="text-xs text-slate-600 mt-1 font-normal normal-case leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}

