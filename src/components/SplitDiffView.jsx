import { useRef, useCallback } from 'react'

/**
 * Renders text segments, highlighting placeholders as chips.
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
                className="inline-block bg-blue-50 dark:bg-blue-900/40 mx-0.5 px-1 py-0 border border-blue-200 dark:border-blue-700 rounded font-mono text-[11px] text-blue-700 dark:text-blue-300"
                title={`Placeholder: ${part}`}
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
      className="flex border-gray-100 dark:border-gray-800 border-b"
      role="row"
    >
      {/* Left (old) side */}
      <div
        className={`flex min-h-[1.75rem] w-1/2 border-r border-gray-200 dark:border-gray-700 ${leftBg}`}
        role="cell"
      >
        {/* Line number */}
        <div className="flex justify-end items-start px-1.5 pt-1 border-gray-200/50 dark:border-gray-700/50 border-r w-10 font-mono text-[11px] text-gray-400 dark:text-gray-500 select-none shrink-0">
          {oldLine?.number || ''}
        </div>
        {/* Indicator */}
        <div className="flex justify-center items-start pt-1 w-5 font-mono font-bold text-[11px] select-none shrink-0">
          {(type === 'removed' || type === 'modified') && (
            <span
              className="text-red-500 dark:text-red-400"
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
        <div className="flex justify-end items-start px-1.5 pt-1 border-gray-200/50 dark:border-gray-700/50 border-r w-10 font-mono text-[11px] text-gray-400 dark:text-gray-500 select-none shrink-0">
          {newLine?.number || ''}
        </div>
        {/* Indicator */}
        <div className="flex justify-center items-start pt-1 w-5 font-mono font-bold text-[11px] select-none shrink-0">
          {(type === 'added' || type === 'modified') && (
            <span
              className="text-green-500 dark:text-green-400"
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
    <div className="animate-slide-up">
      <h3 className="mb-3 font-bold text-gray-900 dark:text-white text-lg">
        Side-by-Side Diff
      </h3>
      <div
        ref={containerRef}
        className="shadow-sm border border-gray-200 dark:border-dark-border rounded-xl max-h-[600px] overflow-auto"
        role="table"
        aria-label="Side-by-side diff comparison"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div
          className="top-0 z-10 sticky flex bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 border-b"
          role="row"
        >
          <div
            className="flex items-center px-4 py-2 border-gray-200 dark:border-gray-700 border-r w-1/2 font-semibold text-red-700 dark:text-red-400 text-xs"
            role="columnheader"
          >
            <span aria-hidden="true" className="mr-1.5">
              −
            </span>
            Old Prompt
          </div>
          <div
            className="flex items-center px-4 py-2 w-1/2 font-semibold text-green-700 dark:text-green-400 text-xs"
            role="columnheader"
          >
            <span aria-hidden="true" className="mr-1.5">
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
    </div>
  )
}

