import { useState } from 'react'
import { Button } from '../atoms/Button'
import { FileField } from '../molecules/FileField'
import { PipelineJsonField } from '../molecules/PipelineJsonField'
import { ModeField } from '../molecules/ModeField'
import { QueryField } from '../molecules/QueryField'
import { TopKField } from '../molecules/TopKField'
import { pipelineModes } from '../../data/pipelineModes'
import { samplePipelineJson } from '../../data/samplePipeline'
import { useFileText } from '../../hooks/useFileText'

export function PipelineForm({ onSubmit, isLoading }) {
  const [file, setFile] = useState(null)
  const [pipeline, setPipeline] = useState(samplePipelineJson)
  const [mode, setMode] = useState(pipelineModes[0].value)
  const [query, setQuery] = useState('')
  const [topK, setTopK] = useState('')

  const loadPipelineFromFile = useFileText(setPipeline)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!file) return
    onSubmit({ file, pipeline, mode, query: query || null, topK: query ? topK || null : null })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl flex flex-col gap-4 bg-white/70 backdrop-blur rounded-xl border border-orange-200 shadow-lg shadow-orange-500/10 p-6"
    >
      <FileField fileName={file?.name} onChange={(event) => setFile(event.target.files[0] ?? null)} />
      <PipelineJsonField
        value={pipeline}
        onChange={(event) => setPipeline(event.target.value)}
        onLoadFile={(event) => loadPipelineFromFile(event.target.files[0])}
      />
      <ModeField value={mode} onChange={(event) => setMode(event.target.value)} />
      <QueryField value={query} onChange={(event) => setQuery(event.target.value)} />
      <TopKField
        value={topK}
        onChange={(event) => setTopK(event.target.value)}
        disabled={!query}
      />
      <Button type="submit" disabled={!file || isLoading}>
        {isLoading ? 'Ejecutando...' : 'Ejecutar pipeline'}
      </Button>
    </form>
  )
}
