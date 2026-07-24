export function ResultPanel({ result, error, isLoading }) {
  if (isLoading) {
    return (
      <div className="w-full max-w-xl rounded-xl border border-orange-200 bg-white/70 p-6 text-amber-800">
        Procesando...
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-xl rounded-xl border border-red-300 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="w-full max-w-xl rounded-xl border border-orange-200 bg-white/70 backdrop-blur shadow-lg shadow-orange-500/10 p-6">
      <p className="text-sm text-amber-700 mb-2">
        Archivo: <span className="font-semibold">{result.filename}</span> · Modo:{' '}
        <span className="font-semibold">{result.mode}</span>
      </p>
      <pre className="w-full overflow-auto max-h-96 text-sm bg-amber-50 rounded-md p-3 text-amber-900">
        {typeof result.result === 'string' ? result.result : JSON.stringify(result.result, null, 2)}
      </pre>
    </div>
  )
}
