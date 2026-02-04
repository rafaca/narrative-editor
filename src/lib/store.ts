import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react'
import { NarrativeNodeData, ChoiceNodeData, Story } from './types'

// Use a generic record type that's compatible with React Flow
type NodeData = Record<string, unknown>

interface EditorState {
  // Canvas state
  nodes: Node<NodeData>[]
  edges: Edge[]

  // Story metadata
  storyId: string
  storyTitle: string

  // Selected elements
  selectedNodeId: string | null

  // Actions
  onNodesChange: (changes: NodeChange<Node<NodeData>>[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void

  // Node operations
  addNode: (type: string, position: { x: number; y: number }) => void
  updateNodeData: (nodeId: string, data: Partial<NarrativeNodeData | ChoiceNodeData>) => void
  deleteNode: (nodeId: string) => void
  setSelectedNode: (nodeId: string | null) => void

  // Story operations
  setStoryTitle: (title: string) => void
  saveStory: () => Story
  loadStory: (story: Story) => void
  clearCanvas: () => void
}

const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const createDefaultNodeData = (type: string): NodeData => {
  if (type === 'choice') {
    return {
      question: 'What do you do?',
      choices: [
        { id: 'choice_1', text: 'Option 1' },
        { id: 'choice_2', text: 'Option 2' },
      ],
    }
  }

  return {
    title: type === 'scene' ? 'New Scene' : `New ${type}`,
    description: '',
    media: [],
  }
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      storyId: generateId(),
      storyTitle: 'Untitled Story',
      selectedNodeId: null,

      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        })
      },

      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        })
      },

      onConnect: (connection) => {
        set({
          edges: addEdge(
            {
              ...connection,
              type: 'smoothstep',
              animated: false,
            },
            get().edges
          ),
        })
      },

      addNode: (type, position) => {
        const newNode: Node<NodeData> = {
          id: generateId(),
          type,
          position,
          data: createDefaultNodeData(type),
        }
        set({
          nodes: [...get().nodes, newNode],
        })
      },

      updateNodeData: (nodeId, data) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, ...data } }
              : node
          ),
        })
      },

      deleteNode: (nodeId) => {
        set({
          nodes: get().nodes.filter((node) => node.id !== nodeId),
          edges: get().edges.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId
          ),
          selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
        })
      },

      setSelectedNode: (nodeId) => {
        set({ selectedNodeId: nodeId })
      },

      setStoryTitle: (title) => {
        set({ storyTitle: title })
      },

      saveStory: () => {
        const state = get()
        const story: Story = {
          id: state.storyId,
          title: state.storyTitle,
          nodes: state.nodes.map((node) => ({
            id: node.id,
            type: (node.type || 'scene') as 'scene' | 'choice' | 'condition' | 'dialogue' | 'media',
            position: node.position,
            data: node.data as unknown as NarrativeNodeData,
          })),
          edges: state.edges.map((edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle || undefined,
            targetHandle: edge.targetHandle || undefined,
            label: typeof edge.label === 'string' ? edge.label : undefined,
          })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        return story
      },

      loadStory: (story) => {
        set({
          storyId: story.id,
          storyTitle: story.title,
          nodes: story.nodes.map((node) => ({
            id: node.id,
            type: node.type,
            position: node.position,
            data: node.data as unknown as NodeData,
          })),
          edges: story.edges.map((edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle,
            targetHandle: edge.targetHandle,
            label: edge.label,
            type: 'smoothstep',
          })),
          selectedNodeId: null,
        })
      },

      clearCanvas: () => {
        set({
          nodes: [],
          edges: [],
          storyId: generateId(),
          storyTitle: 'Untitled Story',
          selectedNodeId: null,
        })
      },
    }),
    {
      name: 'narrative-editor-storage',
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        storyId: state.storyId,
        storyTitle: state.storyTitle,
      }),
    }
  )
)
