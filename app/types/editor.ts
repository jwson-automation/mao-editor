// Text segment (hide/reveal unit) - for UI rendering
export interface TextSegment {
  id: string
  text: string
  hidden: boolean
}

// Line unit - for UI rendering
export interface TextLine {
  id: string
  segments: TextSegment[]
}

// Entire document - for UI rendering
export interface MaoDocument {
  id: string
  lines: TextLine[]
  createdAt: Date
  updatedAt: Date
}

// Document for Firestore storage (text file format)
export interface MaoTextFile {
  id: string
  name: string
  content: string // Text containing {{ }} markers
  createdAt: string
  updatedAt: string
  isAiGenerated?: boolean // Whether AI generated the title
}

// Document list item
export interface MaoFileListItem {
  id: string
  name: string
  updatedAt: string
  isAiGenerated?: boolean
}
