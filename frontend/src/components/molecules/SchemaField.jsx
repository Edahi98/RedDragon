import { Label } from '../atoms/Label'
import { TextArea } from '../atoms/TextArea'

export function SchemaField({ value, onChange, accent = 'purple' }) {
  return (
    <div>
      <Label htmlFor="pipeline-schema">Esquema de extracción (JSON)</Label>
      <p className="mb-2 text-xs text-slate-500">
        Escribe la plantilla JSON con la estructura y nombres de campo que esperas.
      </p>
      <TextArea id="pipeline-schema" value={value} onChange={onChange} rows={5} accent={accent} />
    </div>
  )
}

