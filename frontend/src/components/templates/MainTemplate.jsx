export function MainTemplate({ header, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-amber-100 to-yellow-200 flex flex-col items-center px-4">
      {header}
      <main className="w-full flex flex-col items-center gap-4 py-6">{children}</main>
    </div>
  )
}
