import { useRef, useCallback } from 'react'

/**
 * Renders text segments, highlighting placeholders as chips with accessible labels.
 */
function HighlightedText({ words }) {
  const placeholderRegex = /(\$\{[^}]+\})/g

  return words.map((word, i) => {
    // Split the word text to find placeholders
    const parts = word.text.split(placeholderRegex)

    const baseStyle =
      word.type === 'added'
        ? 'bg-diff-added-highlight dark:bg-dark-diff-added-highlight rounded px-0.5'
        : word.type === 'removed'
          ? 'bg-diff-removed-highlight dark:bg-dark-diff-removed-highlight rounded px-0.5'
          : ''

    return (
      <span key={i} className={baseStyle}>
        {parts.map((part, j) => {
          if (placeholderRegex.test(part)) {
            return (
              <code
                key={j}
                className="mx-0.5 inline-block rounded border border-blue-300 bg-blue-50 px-1 py-0 font-mono text-[11px] font-semibold text-blue-900 dark:border-blue-700 dark:bg-blue-950/60 dark:text-blue-200"
                title={`Placeholder: ${part}`}
                aria-label={`placeholder ${part}`}
              >
                {part}
              </code>
            )
          }
          return <span key={j}>{part}</span>
        })}
      </span>
    )
  })
}

/**
 * A single row in the diff view.
 */
function DiffRow({ row }) {
  const { type, oldLine, newLine } = row

  const leftBg =
    type === 'removed' || type === 'modified'
      ? 'bg-diff-removed-bg dark:bg-dark-diff-removed-bg'
      : 'bg-white dark:bg-dark-bg'
  const rightBg =
    type === 'added' || type === 'modified'
      ? 'bg-diff-added-bg dark:bg-dark-diff-added-bg'
      : 'bg-white dark:bg-dark-bg'

  const leftTextColor =
    type === 'removed' || type === 'modified'
      ? 'text-diff-removed-text dark:text-dark-diff-removed-text'
      : 'text-gray-800 dark:text-gray-200'
  const rightTextColor =
    type === 'added' || type === 'modified'
      ? 'text-diff-added-text dark:text-dark-diff-added-text'
      : 'text-gray-800 dark:text-gray-200'

  return (
    <div
      className="flex border-b border-gray-100 dark:border-gray-800"
      role="row"
    >
      {/* Left (old) side */}
      <div
        className={`flex min-h-[1.75rem] w-1/2 border-r border-gray-200 dark:border-gray-750 ${leftBg}`}
        role="cell"
      >
        {/* Line number */}
        <div className="flex w-10 shrink-0 select-none items-start justify-end border-r border-gray-200/60 px-1.5 pt-1 font-mono text-[11px] text-gray-500 dark:border-gray-700/60 dark:text-gray-400">
          {oldLine?.number || ''}
        </div>
        {/* Indicator */}
        <div className="flex w-5 shrink-0 select-none items-start justify-center pt-1 font-mono text-[11px] font-bold">
          {(type === 'removed' || type === 'modified') && (
            <span
              className="text-red-700 dark:text-red-300"
              aria-label="Line removed"
            >
              −
            </span>
          )}
        </div>
        {/* Content */}
        <div
          className={`min-w-0 flex-1 whitespace-pre-wrap break-words px-2 py-1 font-mono text-xs leading-relaxed ${leftTextColor}`}
        >
          {oldLine ? <HighlightedText words={oldLine.words} /> : ''}
        </div>
      </div>

      {/* Right (new) side */}
      <div
        className={`flex min-h-[1.75rem] w-1/2 ${rightBg}`}
        role="cell"
      >
        {/* Line number */}
        <div className="flex w-10 shrink-0 select-none items-start justify-end border-r border-gray-200/60 px-1.5 pt-1 font-mono text-[11px] text-gray-500 dark:border-gray-700/60 dark:text-gray-400">
          {newLine?.number || ''}
        </div>
        {/* Indicator */}
        <div className="flex w-5 shrink-0 select-none items-start justify-center pt-1 font-mono text-[11px] font-bold">
          {(type === 'added' || type === 'modified') && (
            <span
              className="text-green-700 dark:text-green-300"
              aria-label="Line added"
            >
              +
            </span>
          )}
        </div>
        {/* Content */}
        <div
          className={`min-w-0 flex-1 whitespace-pre-wrap break-words px-2 py-1 font-mono text-xs leading-relaxed ${rightTextColor}`}
        >
          {newLine ? <HighlightedText words={newLine.words} /> : ''}
        </div>
      </div>
    </div>
  )
}

export default function SplitDiffView({ diffRows }) {
  const containerRef = useRef(null)

  const handleKeyDown = useCallback(
    (e) => {
      if (!containerRef.current) return
      const container = containerRef.current
      const scrollAmount = 40
      if (e.key === 'ArrowDown') {
        container.scrollTop += scrollAmount
        e.preventDefault()
      } else if (e.key === 'ArrowUp') {
        container.scrollTop -= scrollAmount
        e.preventDefault()
      }
    },
    []
  )

  if (!diffRows || diffRows.length === 0) return null

  return (
    <section className="animate-slide-up" aria-labelledby="diff-view-heading">
      <h2
        id="diff-view-heading"
        className="mb-3 text-lg font-bold text-gray-900 dark:text-white"
      >
        Side-by-Side Diff
      </h2>
      <div
        ref={containerRef}
        className="max-h-[600px] overflow-auto rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:border-dark-border"
        role="table"
        aria-label="Side-by-side split diff comparison table"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex border-b border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800"
          role="row"
        >
          <div
            className="flex w-1/2 items-center border-r border-gray-200 px-4 py-2.5 text-xs font-bold text-red-800 dark:border-gray-700 dark:text-red-300"
            role="columnheader"
          >
            <span aria-hidden="true" className="mr-1.5 font-mono text-sm">
              −
            </span>
            Old Prompt
          </div>
          <div
            className="flex w-1/2 items-center px-4 py-2.5 text-xs font-bold text-green-800 dark:text-green-300"
            role="columnheader"
          >
            <span aria-hidden="true" className="mr-1.5 font-mono text-sm">
              +
            </span>
            New Prompt
          </div>
        </div>

        {/* Rows */}
        <div role="rowgroup">
          {diffRows.map((row, i) => (
            <DiffRow key={i} row={row} />
          ))}
        </div>
      </div>
    </section>
  )
}
