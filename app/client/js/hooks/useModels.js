import { useEffect, useState } from 'react'

export default function useModels ({ session, setSession }) {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const unmarshal = (response) => response.json()

  const clear = (response) => {
    setModels([])
    setLoading(true)
    setError(false)
    return response
  }

  const receive = (payload) => {
    setModels(payload)
    setLoading(false)
    setSession((prev) => ({...prev, model: payload[0].id}))
    return payload
  }

  const onError = (error) => {
    if (error.name === 'AbortError') {
      return
    }
    setLoading(false)
    setError(true)
  }

  useEffect(() => {
    const controller = new AbortController()
    const path = `/models?provider=${encodeURIComponent(session.provider)}`
    fetch(path, { signal: controller.signal })
      .then(clear)
      .then(unmarshal)
      .then(receive)
      .catch(onError)
    return () => controller.abort()
  }, [session.provider])

  return {
    error,
    loading,
    models,
  }
}
