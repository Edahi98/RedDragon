import { Label } from '../atoms/Label'
import { FileInput } from '../atoms/FileInput'

const ACCEPTED_EXTENSIONS = '.doc,.docx,.xls,.xlsx,.pdf'

export function FileField({ fileName, onChange, accent = 'blue' }) {
  return (
    <div>
      <Label htmlFor="pipeline-file">Documento (PDF, Word, Excel)</Label>
      <FileInput id="pipeline-file" accept={ACCEPTED_EXTENSIONS} onChange={onChange} accent={accent} />
      <p className="mt-1 text-xs text-slate-500">Formatos soportados: .doc, .docx, .xls, .xlsx, .pdf</p>
      {fileName && <p className="mt-1 text-xs text-blue-700 font-medium">📄 Seleccionado: {fileName}</p>}
    </div>
  )
}

