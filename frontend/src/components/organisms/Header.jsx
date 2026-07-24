export function Header({ title, subtitle }) {
  return (
    <header className="w-full py-8 text-center">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-amber-800">{subtitle}</p>}
    </header>
  )
}
