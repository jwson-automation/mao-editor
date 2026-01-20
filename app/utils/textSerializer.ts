import type { TextSegment, TextLine, MaoDocument } from '~/types/editor'

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

// Match only actual characters (alphabets, numbers, Korean, etc.) excluding spaces and special characters
const WORD_CHAR_REGEX = /[\p{L}\p{N}]/u

// Check if character is a word character
function isWordChar(char: string): boolean {
  return WORD_CHAR_REGEX.test(char)
}

// Split text into word/non-word segments
function splitByWordBoundary(text: string, hidden: boolean): TextSegment[] {
  const segments: TextSegment[] = []
  let currentText = ''
  let currentIsWord: boolean | null = null

  for (const char of text) {
    const charIsWord = isWordChar(char)

    if (currentIsWord === null) {
      currentIsWord = charIsWord
      currentText = char
    } else if (charIsWord === currentIsWord) {
      currentText += char
    } else {
      // Boundary found: save previous segment
      if (currentText) {
        segments.push({
          id: generateId(),
          text: currentText,
          hidden: currentIsWord ? hidden : false // Hide only words
        })
      }
      currentText = char
      currentIsWord = charIsWord
    }
  }

  // Last segment
  if (currentText) {
    segments.push({
      id: generateId(),
      text: currentText,
      hidden: currentIsWord ? hidden : false
    })
  }

  return segments
}

// Convert MaoDocument to text containing {{ }} markers
export function serializeToText(doc: MaoDocument): string {
  return doc.lines.map(line => {
    return line.segments.map(seg => {
      if (seg.hidden) {
        return `{{${seg.text}}}`
      }
      return seg.text
    }).join('')
  }).join('\n')
}

// Parse text containing {{ }} markers into MaoDocument
export function parseFromText(text: string): MaoDocument {
  const lines = text.split('\n').map((lineText): TextLine => {
    const segments: TextSegment[] = []
    let currentText = ''
    let i = 0

    while (i < lineText.length) {
      // Check for {{ marker start
      if (lineText[i] === '{' && lineText[i + 1] === '{') {
        // Add previous plain text as segments - split into word/non-word
        if (currentText) {
          segments.push(...splitByWordBoundary(currentText, false))
          currentText = ''
        }

        // Find }} marker end
        i += 2 // Skip {{
        let hiddenText = ''
        while (i < lineText.length) {
          if (lineText[i] === '}' && lineText[i + 1] === '}') {
            // Split hidden text into word/non-word and add
            segments.push(...splitByWordBoundary(hiddenText, true))
            i += 2 // Skip }}
            break
          }
          hiddenText += lineText[i]
          i++
        }
      } else {
        currentText += lineText[i]
        i++
      }
    }

    // Handle remaining plain text - split into word/non-word segments
    if (currentText) {
      segments.push(...splitByWordBoundary(currentText, false))
    }

    // Handle empty line
    if (segments.length === 0) {
      segments.push({
        id: generateId(),
        text: '',
        hidden: false
      })
    }

    return {
      id: generateId(),
      segments
    }
  })

  return {
    id: generateId(),
    lines,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}
