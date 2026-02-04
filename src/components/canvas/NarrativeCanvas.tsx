'use client'

import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
  Node,
  NodeChange,
  EdgeChange,
  Connection,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { SceneNode, ChoiceNode } from './nodes'
import { useEditorStore } from '@/lib/store'

const nodeTypes = {
  scene: SceneNode,
  choice: ChoiceNode,
}

function NarrativeCanvasInner() {
  const { screenToFlowPosition } = useReactFlow()
  const nodes = useEditorStore((state) => state.nodes)
  const edges = useEditorStore((state) => state.edges)
  const onNodesChange = useEditorStore((state) => state.onNodesChange)
  const onEdgesChange = useEditorStore((state) => state.onEdgesChange)
  const onConnect = useEditorStore((state) => state.onConnect)
  const addNode = useEditorStore((state) => state.addNode)
  const setSelectedNode = useEditorStore((state) => state.setSelectedNode)

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/reactflow')
      if (!type) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      addNode(type, position)
    },
    [screenToFlowPosition, addNode]
  )

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node.id)
    },
    [setSelectedNode]
  )

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [setSelectedNode])

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Cast to the expected type
      onNodesChange(changes as NodeChange<Node<Record<string, unknown>>>[])
    },
    [onNodesChange]
  )

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes)
    },
    [onEdgesChange]
  )

  const handleConnect = useCallback(
    (connection: Connection) => {
      onConnect(connection)
    },
    [onConnect]
  )

  const memoizedNodeTypes = useMemo(() => nodeTypes, [])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange}
      onEdgesChange={handleEdgesChange}
      onConnect={handleConnect}
      onNodeClick={handleNodeClick}
      onPaneClick={handlePaneClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      nodeTypes={memoizedNodeTypes}
      fitView
      deleteKeyCode={['Backspace', 'Delete']}
      className="bg-background"
      defaultEdgeOptions={{
        type: 'smoothstep',
        animated: false,
      }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color="hsl(var(--muted-foreground) / 0.2)"
      />
      <Controls
        className="!bg-card !border-border !rounded-lg !shadow-lg"
        showZoom
        showFitView
        showInteractive={false}
      />
      <MiniMap
        className="!bg-card !border-border !rounded-lg"
        nodeColor={(node) => {
          switch (node.type) {
            case 'scene':
              return 'hsl(142.1 76.2% 36.3%)'
            case 'choice':
              return 'hsl(45.4 93.4% 47.5%)'
            default:
              return 'hsl(var(--muted))'
          }
        }}
        maskColor="hsl(var(--background) / 0.8)"
      />
    </ReactFlow>
  )
}

export function NarrativeCanvas() {
  return (
    <ReactFlowProvider>
      <NarrativeCanvasInner />
    </ReactFlowProvider>
  )
}
