'use client'

import { useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Diamond, Sparkles, MessageSquare, MapPin, Image } from 'lucide-react'

interface NodeTypeItem {
  type: string
  label: string
  icon: React.ReactNode
  description: string
}

const nodeTypes: NodeTypeItem[] = [
  {
    type: 'scene',
    label: 'Scene',
    icon: <FileText className="w-5 h-5" />,
    description: 'A narrative scene',
  },
  {
    type: 'choice',
    label: 'Choice',
    icon: <Diamond className="w-5 h-5" />,
    description: 'Branching point',
  },
]

const comingSoon: NodeTypeItem[] = [
  {
    type: 'ai',
    label: 'AI Gen',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'AI generation',
  },
  {
    type: 'dialogue',
    label: 'Dialogue',
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'Character dialogue',
  },
  {
    type: 'location',
    label: 'Location',
    icon: <MapPin className="w-5 h-5" />,
    description: 'Story location',
  },
  {
    type: 'media',
    label: 'Media',
    icon: <Image className="w-5 h-5" />,
    description: 'Image/video only',
  },
]

function DraggableNode({ item }: { item: NodeTypeItem }) {
  const onDragStart = useCallback(
    (event: React.DragEvent, nodeType: string) => {
      event.dataTransfer.setData('application/reactflow', nodeType)
      event.dataTransfer.effectAllowed = 'move'
    },
    []
  )

  return (
    <div
      className="flex flex-col items-center justify-center p-3 rounded-lg bg-accent/50 hover:bg-accent cursor-grab active:cursor-grabbing transition-colors border border-border hover:border-primary/50"
      draggable
      onDragStart={(e) => onDragStart(e, item.type)}
    >
      <div className="text-primary">{item.icon}</div>
      <span className="text-xs mt-1.5 font-medium">{item.label}</span>
    </div>
  )
}

function DisabledNode({ item }: { item: NodeTypeItem }) {
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-muted/30 cursor-not-allowed opacity-50 border border-transparent">
      <div className="text-muted-foreground">{item.icon}</div>
      <span className="text-xs mt-1.5 text-muted-foreground">{item.label}</span>
    </div>
  )
}

export function LeftPanel() {
  return (
    <div className="w-[280px] h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-sm">Node Library</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Drag nodes to the canvas
        </p>
      </div>

      {/* Available Nodes */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
          Add Nodes
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {nodeTypes.map((item) => (
            <DraggableNode key={item.type} item={item} />
          ))}
        </div>

        {/* Coming Soon */}
        <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-3 mt-6">
          Coming Soon
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {comingSoon.map((item) => (
            <DisabledNode key={item.type} item={item} />
          ))}
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Delete:</span> Remove selected node
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          <span className="font-medium">Cmd/Ctrl+S:</span> Save story
        </p>
      </div>
    </div>
  )
}
