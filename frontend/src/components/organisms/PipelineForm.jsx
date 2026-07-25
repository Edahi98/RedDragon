import { useState } from 'react'
import { Button } from '../atoms/Button'
import { FormSection } from '../molecules/FormSection'
import { FileField } from '../molecules/FileField'
import { PipelineJsonField } from '../molecules/PipelineJsonField'
import { ModeField } from '../molecules/ModeField'
import { SchemaToggleField } from '../molecules/SchemaToggleField'
import { SchemaField } from '../molecules/SchemaField'
import { QueryField } from '../molecules/QueryField'
import { TopKField } from '../molecules/TopKField'
import { pipelineModes } from '../../data/pipelineModes'
import { samplePipelineJson } from '../../data/samplePipeline'
import { useFileText } from '../../hooks/useFileText'

export function PipelineForm({ onSubmit, isLoading }) {
  const [file, setFile] = useState(null)
  const [pipeline, setPipeline] = useState(samplePipelineJson)
  const [mode, setMode] = useState(pipelineModes[0].value)
  const [useSchema, setUseSchema] = useState(false)
  const [schema, setSchema] = useState('')
  const [query, setQuery] = useState('')
  const [topK, setTopK] = useState('')

  const loadPipelineFromFile = useFileText(setPipeline)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!file) return
    onSubmit({
      file,
      pipeline,
      mode,
      query: query || null,
      topK: query ? topK || null : null,
      schema: useSchema ? (schema || null) : null,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl flex flex-col gap-5 bg-white/80 backdrop-blur rounded-2xl border border-orange-200 shadow-xl shadow-orange-500/10 p-6"
    >
      <FormSection
        title="Tu documento y pipeline"
        icon="📄"
        accent="blue"
        subtitle="Selecciona el archivo a procesar y revisa la configuración base del proceso"
      >
        <FileField accent="blue" fileName={file?.name} onChange={(event) => setFile(event.target.files[0] ?? null)} />
        <PipelineJsonField
          accent="blue"
          value={pipeline}
          onChange={(event) => setPipeline(event.target.value)}
          onLoadFile={(event) => loadPipelineFromFile(event.target.files[0])}
        />
      </FormSection>

      <FormSection
        title="Salida"
        icon="⚙️"
        accent="purple"
        subtitle="Configura la forma y estructura en que deseas recibir la información procesada"
      >
        <ModeField
          accent="purple"
          value={mode}
          onChange={(event) => setMode(event.target.value)}
          disabled={useSchema}
        />
        <SchemaToggleField
          accent="purple"
          checked={useSchema}
          onChange={(event) => setUseSchema(event.target.checked)}
        />
        {useSchema && (
          <SchemaField accent="purple" value={schema} onChange={(event) => setSchema(event.target.value)} />
        )}
      </FormSection>

      <FormSection
        title="Buscar lo más relevante (opcional)"
        icon="🔍"
        accent="teal"
        subtitle="Filtra y ordena la información por relevancia según tus palabras clave"
      >
        <QueryField accent="teal" value={query} onChange={(event) => setQuery(event.target.value)} />
        <TopKField
          accent="teal"
          value={topK}
          onChange={(event) => setTopK(event.target.value)}
          disabled={!query}
        />
      </FormSection>

      <div className="pt-2">
        <Button type="submit" disabled={!file || isLoading}>
          {isLoading ? 'Ejecutando...' : 'Ejecutar pipeline'}
        </Button>
      </div>
    </form>
  )
}

