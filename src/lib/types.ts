// Core Narrative Types

export interface MediaAttachment {
  type: 'image' | 'gif' | 'video' | 'audio'
  url: string
  thumbnail?: string
  caption?: string
}

export interface NarrativeNodeData {
  title: string
  description: string
  media: MediaAttachment[]
  act?: number
  beat?: string
  emotionalValence?: number // -10 to +10 (Vonnegut curve)
}

export interface NarrativeNode {
  id: string
  type: 'scene' | 'choice' | 'condition' | 'dialogue' | 'media'
  position: { x: number; y: number }
  data: NarrativeNodeData
}

export interface NarrativeEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  label?: string
  condition?: string
}

// Story container
export interface Story {
  id: string
  title: string
  description?: string
  nodes: NarrativeNode[]
  edges: NarrativeEdge[]
  createdAt: string
  updatedAt: string
}

// JSON Canvas Format (Obsidian/Craft compatible)
export interface CanvasNode {
  id: string
  type: 'text' | 'file' | 'link' | 'group'
  x: number
  y: number
  width: number
  height: number
  text?: string
  file?: string
  url?: string
  color?: string
}

export interface CanvasEdge {
  id: string
  fromNode: string
  toNode: string
  fromSide?: 'top' | 'right' | 'bottom' | 'left'
  toSide?: 'top' | 'right' | 'bottom' | 'left'
  label?: string
  color?: string
}

export interface CanvasData {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

// React Flow node data types
export interface SceneNodeData extends NarrativeNodeData {
  onTitleChange?: (title: string) => void
  onDescriptionChange?: (description: string) => void
}

export interface ChoiceNodeData {
  question: string
  choices: { id: string; text: string }[]
  onQuestionChange?: (question: string) => void
  onChoiceChange?: (choiceId: string, text: string) => void
  onAddChoice?: () => void
  onRemoveChoice?: (choiceId: string) => void
}
