import { useState } from 'react'
import { EXECUTE_PIPELINE_URL } from '../data/apiConfig'

export function useExecutePipeline() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const execute = async ({ file, pipeline, mode, query, topK, schema }) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('pipeline', pipeline)
      formData.append('mode', mode)
      if (query) formData.append('query', query)
      if (query && topK) formData.append('top_k', topK)
      if (schema) formData.append('schema', schema)

      const response = await fetch(EXECUTE_PIPELINE_URL, { method: 'POST', body: formData })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Error al ejecutar el pipeline')
      }

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return { execute, result, error, isLoading }
}
