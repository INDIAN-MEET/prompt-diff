import * as Diff from 'diff'

/**
 * Builds a line-level diff with word-level highlighting for changed lines.
 *
 * @param {string} oldText - The old prompt text
 * @param {string} newText - The new prompt text
 * @returns {Array<{
 *   type: 'equal' | 'removed' | 'added' | 'modified',
 *   oldLine: { number: number|null, text: string, words: Array<{text: string, type: string}> } | null,
 *   newLine: { number: number|null, text: string, words: Array<{text: string, type: string}> } | null,
 * }>}
 */
export function buildDiff(oldText, newText) {
  if (oldText == null) oldText = ''
  if (newText == null) newText = ''

  const lineDiffs = Diff.diffLines(oldText, newText)
  const result = []

  let oldLineNum = 1
  let newLineNum = 1

  // Process diff chunks and pair removals with additions for word-level diff
  const chunks = []
  for (const part of lineDiffs) {
    const lines = splitLines(part.value)
    chunks.push({
      type: part.added ? 'added' : part.removed ? 'removed' : 'equal',
      lines,
    })
  }

  // Merge adjacent removed+added chunks into 'modified' pairs
  let i = 0
  while (i < chunks.length) {
    const chunk = chunks[i]

    if (
      chunk.type === 'removed' &&
      i + 1 < chunks.length &&
      chunks[i + 1].type === 'added'
    ) {
      const removedLines = chunk.lines
      const addedLines = chunks[i + 1].lines
      const maxLen = Math.max(removedLines.length, addedLines.length)

      for (let j = 0; j < maxLen; j++) {
        const oldLine = j < removedLines.length ? removedLines[j] : null
        const newLine = j < addedLines.length ? addedLines[j] : null

        if (oldLine !== null && newLine !== null) {
          // Both exist: do word-level diff
          const wordDiff = Diff.diffWords(oldLine, newLine)
          const oldWords = []
          const newWords = []

          for (const w of wordDiff) {
            if (w.added) {
              newWords.push({ text: w.value, type: 'added' })
            } else if (w.removed) {
              oldWords.push({ text: w.value, type: 'removed' })
            } else {
              oldWords.push({ text: w.value, type: 'equal' })
              newWords.push({ text: w.value, type: 'equal' })
            }
          }

          result.push({
            type: 'modified',
            oldLine: { number: oldLineNum++, text: oldLine, words: oldWords },
            newLine: { number: newLineNum++, text: newLine, words: newWords },
          })
        } else if (oldLine !== null) {
          result.push({
            type: 'removed',
            oldLine: {
              number: oldLineNum++,
              text: oldLine,
              words: [{ text: oldLine, type: 'removed' }],
            },
            newLine: null,
          })
        } else {
          result.push({
            type: 'added',
            oldLine: null,
            newLine: {
              number: newLineNum++,
              text: newLine,
              words: [{ text: newLine, type: 'added' }],
            },
          })
        }
      }

      i += 2
    } else if (chunk.type === 'removed') {
      for (const line of chunk.lines) {
        result.push({
          type: 'removed',
          oldLine: {
            number: oldLineNum++,
            text: line,
            words: [{ text: line, type: 'removed' }],
          },
          newLine: null,
        })
      }
      i++
    } else if (chunk.type === 'added') {
      for (const line of chunk.lines) {
        result.push({
          type: 'added',
          oldLine: null,
          newLine: {
            number: newLineNum++,
            text: line,
            words: [{ text: line, type: 'added' }],
          },
        })
      }
      i++
    } else {
      // equal
      for (const line of chunk.lines) {
        result.push({
          type: 'equal',
          oldLine: {
            number: oldLineNum++,
            text: line,
            words: [{ text: line, type: 'equal' }],
          },
          newLine: {
            number: newLineNum++,
            text: line,
            words: [{ text: line, type: 'equal' }],
          },
        })
      }
      i++
    }
  }

  return result
}

/**
 * Computes simple line-level change statistics.
 *
 * @param {string} oldText
 * @param {string} newText
 * @returns {{ linesAdded: number, linesRemoved: number }}
 */
export function getLineStats(oldText, newText) {
  const lineDiffs = Diff.diffLines(oldText || '', newText || '')
  let linesAdded = 0
  let linesRemoved = 0

  for (const part of lineDiffs) {
    const count = splitLines(part.value).length
    if (part.added) linesAdded += count
    else if (part.removed) linesRemoved += count
  }

  return { linesAdded, linesRemoved }
}

/**
 * Split text into lines, handling the trailing newline edge case.
 * "a\nb\n" should give ["a", "b"], not ["a", "b", ""].
 */
function splitLines(text) {
  if (!text) return []
  const lines = text.split('\n')
  // If the text ends with \n, the last element will be an empty string
  if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop()
  }
  return lines
}
