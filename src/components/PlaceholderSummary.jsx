/**
 * Renders a placeholder as a styled chip.
 */
function PlaceholderChip({ name, count, variant = 'default' }) {
  const variantStyles = {
    added:
      'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700',
    removed:
      'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700',
    unchanged:
      'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
    default:
      'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs ${variantStyles[variant]}`}
    >
      {'${'}
      {name}
      {'}'}
      {count > 1 && (
        <span className="ml-0.5 text-[10px] opacity-70">×{count}</span>
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
    <div className="animate-slide-up rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-surface">
      <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
        Placeholder Summary
      </h3>

      {/* Big numbers */}
      <div className="mb-5 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[140px] rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800/50">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {oldPlaceholders.unique.length}
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Old prompt placeholders
            {oldPlaceholders.total !== oldPlaceholders.unique.length && (
              <span className="block text-[10px] opacity-70">
                ({oldPlaceholders.total} total occurrences)
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-[140px] rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800/50">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {newPlaceholders.unique.length}
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            New prompt placeholders
            {newPlaceholders.total !== newPlaceholders.unique.length && (
              <span className="block text-[10px] opacity-70">
                ({newPlaceholders.total} total occurrences)
              </span>
            )}
          </div>
        </div>
      </div>

      {identical ? (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 p-4 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          <svg
            className="h-5 w-5 shrink-0"
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
              <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-amber-700 dark:text-amber-400">
                <span aria-hidden="true">🔄</span> Renamed
              </h4>
              <div className="flex flex-wrap gap-2">
                {pairs.map((pair) => (
                  <span
                    key={`${pair.removed}-${pair.added}`}
                    className="inline-flex items-center gap-1 text-sm"
                  >
                    <PlaceholderChip name={pair.removed} variant="removed" />
                    <span className="text-gray-400" aria-label="changed to">
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
              <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-green-700 dark:text-green-400">
                <span aria-hidden="true">🟢</span> New found
                <span className="sr-only">
                  ({added.length} new placeholder{added.length !== 1 ? 's' : ''})
                </span>
              </h4>
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
                  <span className="text-xs text-gray-400 italic">
                    All new placeholders shown as renames above
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Removed */}
          {removed.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400">
                <span aria-hidden="true">🔴</span> Removed
                <span className="sr-only">
                  ({removed.length} removed placeholder{removed.length !== 1 ? 's' : ''})
                </span>
              </h4>
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
                  <span className="text-xs text-gray-400 italic">
                    All removed placeholders shown as renames above
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Unchanged */}
          {unchanged.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-400">
                <span aria-hidden="true">⚪</span> Unchanged
              </h4>
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
    </div>
  )
}
