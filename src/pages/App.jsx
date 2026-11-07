import { useState, useCallback } from 'react'
import PromptInput from '../components/PromptInput'
import PlaceholderSummary from '../components/PlaceholderSummary'
import { comparePlaceholders } from '../utils/comparePlaceholders'

export default function App() {
  const [oldText, setOldText] = useState('')
  const [newText, setNewText] = useState('')
  const [results, setResults] = useState(null)

  const handleCompare = useCallback(() => {
    if (!oldText.trim() || !newText.trim()) return

    const comparison = comparePlaceholders(oldText, newText)
    setResults({ comparison })
  }, [oldText, newText])

  const handleClear = useCallback(() => {
    setOldText('')
    setNewText('')
    setResults(null)
  }, [])

  const handleSwap = useCallback(() => {
    setOldText(newText)
    setNewText(oldText)
    setResults(null)
  }, [oldText, newText])

  const handleLoadSample = useCallback((sampleOld, sampleNew) => {
    setOldText(sampleOld)
    setNewText(sampleNew)
    setResults(null)
  }, [])

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Compare Prompts
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Paste your old and new prompt below, then click Compare.
        </p>
      </div>

      <PromptInput
        oldText={oldText}
        newText={newText}
        onOldChange={setOldText}
        onNewChange={setNewText}
        onCompare={handleCompare}
        onClear={handleClear}
        onSwap={handleSwap}
        onLoadSample={handleLoadSample}
      />

      {results && (
        <div className="mt-8 space-y-8">
          <PlaceholderSummary comparison={results.comparison} />
        </div>
      )}
    </div>
  )
}
