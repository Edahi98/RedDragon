import { Label } from '../atoms/Label'
import { TextInput } from '../atoms/TextInput'

export function TopKField({ value, onChange, disabled, accent = 'teal' }) {
  return (
    <div>
      <Label htmlFor="pipeline-top-k">¿Cuántos resultados quieres? (opcional)</Label>
      <TextInput
        id="pipeline-top-k"
        type="number"
        min={1}
        value={value}
        onChange={onChange}
        placeholder="Todos los resultados"
        disabled={disabled}
        accent={accent}
      />
      <p className="mt-1 text-xs text-slate-500">
        Límite máximo de fragmentos más relevantes a obtener (deja vacío para obtener todos).
      </p>
    </div>
  )
}

