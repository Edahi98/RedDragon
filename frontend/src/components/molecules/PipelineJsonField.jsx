import { Label } from '../atoms/Label'
import { TextArea } from '../atoms/TextArea'

export function PipelineJsonField({ value, onChange, onLoadFile }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <Label htmlFor="pipeline-json">JSON del pipeline</Label>
        <label htmlFor="pipeline-json-file" className="text-xs font-medium text-orange-700 hover:text-orange-800 cursor-pointer">
          Cargar desde archivo
        </label>
      </div>
      <input
        id="pipeline-json-file"
        type="file"
        accept=".json,application/json"
        onChange={onLoadFile}
        className="hidden"
      />
      <TextArea id="pipeline-json" value={value} onChange={onChange} />
    </div>
  )
}
