import { Label } from '../atoms/Label'
import { TextInput } from '../atoms/TextInput'

export function TopKField({ value, onChange, disabled }) {
  return (
    <div>
      <Label htmlFor="pipeline-top-k">Top K (opcional)</Label>
      <TextInput
        id="pipeline-top-k"
        type="number"
        min={1}
        value={value}
        onChange={onChange}
        placeholder="todos"
        disabled={disabled}
      />
    </div>
  )
}
