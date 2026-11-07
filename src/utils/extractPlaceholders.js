/**
 * Extracts JavaScript template literal placeholders from a string.
 *
 * Rules:
 * - Matches ${...} patterns
 * - Trims whitespace inside: ${ variable } → "variable"
 * - Supports dotted names: ${user.name} → "user.name"
 * - Supports bracket names: ${items[0]} → "items[0]"
 * - Supports expressions: ${ a + b } → "a + b"
 * - Ignores escaped: \${notAPlaceholder}
 * - Returns unique names with occurrence counts
 *
 * @param {string} text - The text to extract placeholders from
 * @returns {{ unique: Array<{name: string, count: number}>, total: number }}
 */
export function extractPlaceholders(text) {
  if (!text || typeof text !== 'string') {
    return { unique: [], total: 0 }
  }

  // Match ${...} but not \${...}
  // Uses a negative lookbehind for backslash
  const regex = /(?<!\\)\$\{([^}]+)\}/g
  const counts = new Map()
  let match

  while ((match = regex.exec(text)) !== null) {
    const name = match[1].trim()
    if (name) {
      counts.set(name, (counts.get(name) || 0) + 1)
    }
  }

  const unique = Array.from(counts.entries()).map(([name, count]) => ({
    name,
    count,
  }))

  const total = unique.reduce((sum, p) => sum + p.count, 0)

  return { unique, total }
}

/**
 * Get just the set of unique placeholder names from text.
 * @param {string} text
 * @returns {string[]}
 */
export function getPlaceholderNames(text) {
  return extractPlaceholders(text).unique.map((p) => p.name)
}
