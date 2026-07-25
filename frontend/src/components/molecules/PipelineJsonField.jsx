import { Label } from '../atoms/Label'
import { TextArea } from '../atoms/TextArea'

export function PipelineJsonField({ value, onChange, onLoadFile, accent = 'blue' }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <Label htmlFor="pipeline-json">JSON del pipeline</Label>
        <label htmlFor="pipeline-json-file" className="text-xs font-medium text-blue-700 hover:text-blue-800 cursor-pointer flex items-center gap-1">
          📁 Cargar desde archivo
        </label>
      </div>
      <p className="mb-2 text-xs text-slate-500">
        Configuración técnica del proceso (no la edites si no sabes qué hace)
      </p>
      <input
        id="pipeline-json-file"
        type="file"
        accept=".json,application/json"
        onChange={onLoadFile}
        className="hidden"
      />
      <TextArea id="pipeline-json" value={value} onChange={onChange} accent={accent} />
    </div>
  )
}

