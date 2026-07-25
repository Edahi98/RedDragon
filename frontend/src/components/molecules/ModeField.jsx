import { Label } from '../atoms/Label'
import { Select } from '../atoms/Select'
import { pipelineModes } from '../../data/pipelineModes'

export function ModeField({ value, onChange, disabled = false, accent = 'purple' }) {
  return (
    <div>
      <Label htmlFor="pipeline-mode">¿Cómo quieres el resultado?</Label>
      <Select id="pipeline-mode" value={value} onChange={onChange} options={pipelineModes} disabled={disabled} accent={accent} />
      {disabled ? (
        <p className="mt-1 text-xs text-purple-700 font-medium">
          El modo de salida no aplica cuando se usa un esquema.
        </p>
      ) : (
        <p className="mt-1 text-xs text-slate-500">
          Elige el formato estructural de la salida procesada.
        </p>
      )}
    </div>
  )
}

