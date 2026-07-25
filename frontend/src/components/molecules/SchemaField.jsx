import { Label } from '../atoms/Label'
import { TextArea } from '../atoms/TextArea'

export function SchemaField({ value, onChange }) {
  return (
    <div>
      <Label htmlFor="pipeline-schema">Esquema de extracción NuExtract (JSON, opcional)</Label>
      <TextArea id="pipeline-schema" value={value} onChange={onChange} rows={5} />
    </div>
  )
}
