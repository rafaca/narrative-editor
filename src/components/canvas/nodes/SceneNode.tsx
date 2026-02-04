'use client'

import { memo, useCallback } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useEditorStore } from '@/lib/store'
import { ImageIcon, Sparkles, MoreVertical, GripVertical } from 'lucide-react'

interface SceneData {
  title?: string
  description?: string
  media?: { url: string; caption?: string }[]
}

function SceneNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as SceneData
  const updateNodeData = useEditorStore((state) => state.updateNodeData)

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { title: e.target.value })
    },
    [id, updateNodeData]
  )

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { description: e.target.value })
    },
    [id, updateNodeData]
  )

  return (
    <Card
      className={`w-[280px] bg-card border-border shadow-lg transition-all ${
        selected ? 'ring-2 ring-primary' : ''
      }`}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background"
      />

      {/* Header with drag handle */}
      <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Scene
          </span>
        </div>
        <button className="p-1 hover:bg-accent rounded">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-3">
        {/* Image placeholder */}
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-dashed border-border overflow-hidden">
          {nodeData.media && nodeData.media.length > 0 ? (
            <img
              src={nodeData.media[0].url}
              alt={nodeData.media[0].caption || nodeData.title || 'Scene image'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs">Drop image or generate</span>
            </div>
          )}
        </div>

        {/* Title input */}
        <Input
          value={nodeData.title || ''}
          onChange={handleTitleChange}
          placeholder="Scene Title"
          className="font-medium text-sm bg-transparent border-none p-0 h-auto focus-visible:ring-0"
        />

        {/* Description textarea */}
        <Textarea
          value={nodeData.description || ''}
          onChange={handleDescriptionChange}
          placeholder="Scene description..."
          className="text-xs text-muted-foreground resize-none min-h-[60px] bg-transparent border-none p-0 focus-visible:ring-0"
          rows={3}
        />

        {/* Action buttons */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors">
            <Sparkles className="w-3 h-3" />
            Generate
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-accent text-accent-foreground hover:bg-accent/80 transition-colors">
            <ImageIcon className="w-3 h-3" />
            Upload
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export const SceneNode = memo(SceneNodeComponent)
