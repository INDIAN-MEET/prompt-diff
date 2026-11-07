import { useRef } from 'react'

const SAMPLE_OLD = `Hello \${userName},
your order \${orderId} is ready.`

const SAMPLE_NEW = `Hello \${customerName},
your order \${orderId} is ready.
Delivery on \${deliveryDate}.`

export default function PromptInput({
  oldText,
  newText,
  onOldChange,
  onNewChange,
  onCompare,
  onClear,
  onSwap,
  onLoadSample,
}) {
  const oldRef = useRef(null)
  const newRef = useRef(null)

  const handleLoadSample = () => {
    onLoadSample(SAMPLE_OLD, SAMPLE_NEW)
  }

  const bothEmpty = !oldText.trim() && !newText.trim()
  const hasIncomplete = (!oldText.trim() || !newText.trim()) && (oldText.trim() || newText.trim())

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Old Prompt */}
        <div>
          <label
            htmlFor="old-prompt"
            className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200"
          >
            Old Prompt
          </label>
          <textarea
            ref={oldRef}
            id="old-prompt"
            value={oldText}
            onChange={(e) => onOldChange(e.target.value)}
            placeholder="Paste your old prompt here..."
            className="h-48 w-full resize-y rounded-xl border border-gray-300 bg-white p-4 font-mono text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:placeholder:text-gray-500 dark:focus:border-primary-400 dark:focus:ring-primary-400/20"
            aria-describedby="old-prompt-desc"
          />
          <p id="old-prompt-desc" className="sr-only">
            Enter the original version of your prompt
          </p>
        </div>

        {/* New Prompt */}
        <div>
          <label
            htmlFor="new-prompt"
            className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200"
          >
            New Prompt
          </label>
          <textarea
            ref={newRef}
            id="new-prompt"
            value={newText}
            onChange={(e) => onNewChange(e.target.value)}
            placeholder="Paste your new prompt here..."
            className="h-48 w-full resize-y rounded-xl border border-gray-300 bg-white p-4 font-mono text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:placeholder:text-gray-500 dark:focus:border-primary-400 dark:focus:ring-primary-400/20"
            aria-describedby="new-prompt-desc"
          />
          <p id="new-prompt-desc" className="sr-only">
            Enter the updated version of your prompt
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={onCompare}
          disabled={!oldText.trim() || !newText.trim()}
          className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus-visible:outline-primary-400"
          aria-label="Compare prompts"
        >
          🔍 Compare
        </button>

        <button
          onClick={onSwap}
          disabled={bothEmpty}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 dark:border-dark-border dark:bg-dark-surface dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Swap old and new prompts"
          title="Swap old and new prompts"
        >
          ⇄ Swap
        </button>

        <button
          onClick={onClear}
          disabled={bothEmpty}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 dark:border-dark-border dark:bg-dark-surface dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Clear both prompts"
        >
          ✕ Clear
        </button>

        <button
          onClick={handleLoadSample}
          className="rounded-lg border border-primary-300 bg-primary-50 px-4 py-2.5 text-sm font-medium text-primary-800 shadow-sm transition-all hover:bg-primary-100 hover:shadow-md active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-300 dark:hover:bg-primary-900/50"
          aria-label="Load sample example"
        >
          📋 Load Sample
        </button>
      </div>

      {/* Friendly error / warning */}
      {hasIncomplete && (
        <p className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-400" role="alert">
          💡 Please paste both prompts first to compare.
        </p>
      )}
    </div>
  )
}
