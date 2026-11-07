import { useState, useCallback } from 'react'
import PromptInput from '../components/PromptInput'
import PlaceholderSummary from '../components/PlaceholderSummary'
import StatCards from '../components/StatCards'
import SplitDiffView from '../components/SplitDiffView'
import { comparePlaceholders } from '../utils/comparePlaceholders'
import { buildDiff, getLineStats } from '../utils/buildDiff'

export default function App() {
  const [oldText, setOldText] = useState('')
  const [newText, setNewText] = useState('')
  const [results, setResults] = useState(null)
  const [copiedSummary, setCopiedSummary] = useState(false)
  const [copiedDiff, setCopiedDiff] = useState(false)

  const handleCompare = useCallback(() => {
    if (!oldText.trim() || !newText.trim()) return

    const comparison = comparePlaceholders(oldText, newText)
    const diffRows = buildDiff(oldText, newText)
    const lineStats = getLineStats(oldText, newText)

    setResults({ comparison, diffRows, lineStats })
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

  const copyToClipboard = async (text, setCopied) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      setCopied(false)
    }
  }

  const handleCopySummary = useCallback(() => {
    if (!results) return
    const { comparison } = results
    const lines = ['--- Placeholder Summary ---', '']
    lines.push(
      `Old prompt: ${comparison.oldPlaceholders.unique.length} unique (${comparison.oldPlaceholders.total} total)`
    )
    lines.push(
      `New prompt: ${comparison.newPlaceholders.unique.length} unique (${comparison.newPlaceholders.total} total)`
    )
    lines.push('')

    if (comparison.identical) {
      lines.push('Status: No placeholder changes (identical)')
    } else {
      if (comparison.added.length > 0) {
        lines.push(
          `New found: ${comparison.added.map((p) => '${' + p.name + '}').join(', ')}`
        )
      }
      if (comparison.removed.length > 0) {
        lines.push(
          `Removed: ${comparison.removed.map((p) => '${' + p.name + '}').join(', ')}`
        )
      }
      if (comparison.unchanged.length > 0) {
        lines.push(
          `Unchanged: ${comparison.unchanged.map((p) => '${' + p.name + '}').join(', ')}`
        )
      }
      if (comparison.pairs.length > 0) {
        lines.push('')
        lines.push('Renamed pairs:')
        comparison.pairs.forEach((pair) => {
          lines.push(`  \${${pair.removed}} → \${${pair.added}}`)
        })
      }
    }

    copyToClipboard(lines.join('\n'), setCopiedSummary)
  }, [results])

  const handleCopyDiff = useCallback(() => {
    if (!results) return
    const { diffRows } = results
    const lines = diffRows.map((row) => {
      if (row.type === 'modified') {
        return `- ${row.oldLine?.text || ''}\n+ ${row.newLine?.text || ''}`
      }
      if (row.type === 'removed') {
        return `- ${row.oldLine?.text || ''}`
      }
      if (row.type === 'added') {
        return `+ ${row.newLine?.text || ''}`
      }
      return `  ${row.oldLine?.text || ''}`
    })

    copyToClipboard(lines.join('\n'), setCopiedDiff)
  }, [results])

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

      {/* Step 1: Inputs */}
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

      {/* Results */}
      {results && (
        <div className="mt-8 space-y-8">
          {/* Action buttons for copying */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-95 dark:border-dark-border dark:bg-dark-surface dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Copy placeholder summary to clipboard"
            >
              📋 {copiedSummary ? 'Copied Summary!' : 'Copy Summary'}
            </button>
            <button
              onClick={handleCopyDiff}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-95 dark:border-dark-border dark:bg-dark-surface dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Copy diff text to clipboard"
            >
              📋 {copiedDiff ? 'Copied Diff!' : 'Copy Diff'}
            </button>
          </div>

          {/* Step 2: Placeholder Summary */}
          <PlaceholderSummary comparison={results.comparison} />

          {/* Step 3: Change Counter */}
          <StatCards
            linesAdded={results.lineStats.linesAdded}
            linesRemoved={results.lineStats.linesRemoved}
            placeholdersAdded={results.comparison.added.length}
            placeholdersRemoved={results.comparison.removed.length}
            placeholdersUnchanged={results.comparison.unchanged.length}
          />

          {/* Step 4: Side-by-Side Diff */}
          <SplitDiffView diffRows={results.diffRows} />
        </div>
      )}
    </div>
  )
}
