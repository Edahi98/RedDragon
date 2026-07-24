import { Label } from '../atoms/Label'
import { TextInput } from '../atoms/TextInput'

export function QueryField({ value, onChange }) {
  return (
    <div>
      <Label htmlFor="pipeline-query">Query de reranking (opcional)</Label>
      <TextInput
        id="pipeline-query"
        value={value}
        onChange={onChange}
        placeholder="ej. ingresos por producto"
      />
    </div>
  )
}
