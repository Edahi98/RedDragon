import { Label } from '../atoms/Label'
import { Select } from '../atoms/Select'
import { pipelineModes } from '../../data/pipelineModes'

export function ModeField({ value, onChange }) {
  return (
    <div>
      <Label htmlFor="pipeline-mode">Modo de salida</Label>
      <Select id="pipeline-mode" value={value} onChange={onChange} options={pipelineModes} />
    </div>
  )
}
