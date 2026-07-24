export function FileInput({ id, accept, onChange }) {
  return (
    <input
      id={id}
      type="file"
      accept={accept}
      onChange={onChange}
      className="w-full text-sm text-amber-900 file:mr-3 file:px-4 file:py-2 file:rounded-md file:border-0 file:bg-gradient-to-r file:from-orange-500 file:to-amber-400 file:text-white file:font-medium file:cursor-pointer hover:file:from-orange-600 hover:file:to-amber-500 border border-orange-200 rounded-md bg-white/80"
    />
  )
}
