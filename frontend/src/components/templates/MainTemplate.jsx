import bgWarm from '../../assets/bg-warm.svg'

export function MainTemplate({ header, children }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col items-center px-4 relative"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(254, 243, 199, 0.3), rgba(255, 237, 213, 0.3)), url("${bgWarm}")`,
      }}
    >
      {header}
      <main className="w-full flex flex-col items-center gap-4 py-6 z-10">{children}</main>
    </div>
  )
}

