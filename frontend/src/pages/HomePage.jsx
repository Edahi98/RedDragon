import { Header } from '../components/organisms/Header'
import { PipelineForm } from '../components/organisms/PipelineForm'
import { ResultPanel } from '../components/organisms/ResultPanel'
import { MainTemplate } from '../components/templates/MainTemplate'
import { useExecutePipeline } from '../hooks/useExecutePipeline'

export function HomePage() {
  const { execute, result, error, isLoading } = useExecutePipeline()

  return (
    <MainTemplate
      header={<Header title="RedDragon" subtitle="Entorno de pruebas para /execute_pipeline" />}
    >
      <PipelineForm onSubmit={execute} isLoading={isLoading} />
      <ResultPanel result={result} error={error} isLoading={isLoading} />
    </MainTemplate>
  )
}
