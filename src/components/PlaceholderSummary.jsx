/**
 * Renders a placeholder as an accessible styled chip with symbols.
 */
function PlaceholderChip({ name, count, variant = 'default' }) {
  const variantStyles = {
    added:
      'bg-green-100 text-green-900 border-green-300 dark:bg-green-950/60 dark:text-green-300 dark:border-green-700',
    removed:
      'bg-red-100 text-red-900 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-700',
    unchanged:
      'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600',
    default:
      'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-700',
  }

  const symbol = variant === 'added' ? '+ ' : variant === 'removed' ? '− ' : ''

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs font-medium ${variantStyles[variant]}`}
    >
      <span className="font-bold select-none" aria-hidden="true">
        {symbol}
      </span>
      <span>
        {'${'}
        {name}
        {'}'}
      </span>
      {count > 1 && (
        <span
          className="ml-0.5 text-[10px] font-semibold opacity-75"
          title={`Used ${count} times`}
          aria-label={`used ${count} times`}
        >
          (used {count} times)
        </span>
      )}
    </span>
  )
}

export default function PlaceholderSummary({ comparison }) {
  if (!comparison) return null

  const {
    oldPlaceholders,
    newPlaceholders,
    added,
    removed,
    unchanged,
    pairs,
    identical,
  } = comparison

  return (
    <section
      className="animate-slide-up rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-surface"
      aria-labelledby="placeholder-summary-heading"
    >
      <h2
        id="placeholder-summary-heading"
        className="mb-4 text-lg font-bold text-gray-900 dark:text-white"
      >
        Placeholder Summary
      </h2>

      {/* Big numbers */}
      <div className="mb-5 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[140px] rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800/50">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {oldPlaceholders.unique.length}
          </div>
          <div className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-300">
            Old prompt placeholders
            {oldPlaceholders.total !== oldPlaceholders.unique.length && (
              <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                ({oldPlaceholders.total} total occurrences)
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-[140px] rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800/50">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {newPlaceholders.unique.length}
          </div>
          <div className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-300">
            New prompt placeholders
            {newPlaceholders.total !== newPlaceholders.unique.length && (
              <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                ({newPlaceholders.total} total occurrences)
              </span>
            )}
          </div>
        </div>
      </div>

      {identical ? (
        <div
          className="flex items-center gap-2 rounded-xl bg-green-50 p-4 text-green-900 dark:bg-green-950/40 dark:text-green-200 border border-green-200 dark:border-green-800"
          role="status"
        >
          <svg
            className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-sm font-medium">
            No placeholder changes — all placeholders are identical in both prompts.
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pairs (renamed) */}
          {pairs.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-amber-800 dark:text-amber-300">
                <span aria-hidden="true">🔄</span> Renamed
              </h3>
              <div className="flex flex-wrap gap-2">
                {pairs.map((pair) => (
                  <span
                    key={`${pair.removed}-${pair.added}`}
                    className="inline-flex items-center gap-1.5 text-sm"
                  >
                    <PlaceholderChip name={pair.removed} variant="removed" />
                    <span
                      className="font-bold text-gray-500 dark:text-gray-400"
                      aria-label="renamed to"
                    >
                      →
                    </span>
                    <PlaceholderChip name={pair.added} variant="added" />
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* New found */}
          {added.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-green-800 dark:text-green-300">
                <span aria-hidden="true">🟢</span> New found
                <span className="sr-only">
                  ({added.length} new placeholder{added.length !== 1 ? 's' : ''})
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {added
                  .filter((p) => !pairs.some((pair) => pair.added === p.name))
                  .map((p) => (
                    <PlaceholderChip
                      key={p.name}
                      name={p.name}
                      count={p.count}
                      variant="added"
                    />
                  ))}
                {added.filter((p) => !pairs.some((pair) => pair.added === p.name))
                  .length === 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                    All new placeholders shown as renames above
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Removed */}
          {removed.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-red-800 dark:text-red-300">
                <span aria-hidden="true">🔴</span> Removed
                <span className="sr-only">
                  ({removed.length} removed placeholder{removed.length !== 1 ? 's' : ''})
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {removed
                  .filter((p) => !pairs.some((pair) => pair.removed === p.name))
                  .map((p) => (
                    <PlaceholderChip
                      key={p.name}
                      name={p.name}
                      count={p.count}
                      variant="removed"
                    />
                  ))}
                {removed.filter(
                  (p) => !pairs.some((pair) => pair.removed === p.name)
                ).length === 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                    All removed placeholders shown as renames above
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Unchanged */}
          {unchanged.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <span aria-hidden="true">⚪</span> Unchanged
              </h3>
              <div className="flex flex-wrap gap-2">
                {unchanged.map((p) => (
                  <PlaceholderChip
                    key={p.name}
                    name={p.name}
                    count={p.count}
                    variant="unchanged"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
