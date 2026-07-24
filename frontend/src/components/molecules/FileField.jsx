import { Label } from '../atoms/Label'
import { FileInput } from '../atoms/FileInput'

const ACCEPTED_EXTENSIONS = '.doc,.docx,.xls,.xlsx,.pdf'

export function FileField({ fileName, onChange }) {
  return (
    <div>
      <Label htmlFor="pipeline-file">Documento (doc, docx, xls, xlsx, pdf)</Label>
      <FileInput id="pipeline-file" accept={ACCEPTED_EXTENSIONS} onChange={onChange} />
      {fileName && <p className="mt-1 text-xs text-amber-700">Seleccionado: {fileName}</p>}
    </div>
  )
}
