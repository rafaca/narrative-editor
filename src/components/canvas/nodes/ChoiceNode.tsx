'use client'

import { memo, useCallback } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useEditorStore } from '@/lib/store'
import { Diamond, Plus, X, GripVertical, MoreVertical } from 'lucide-react'

interface Choice {
  id: string
  text: string
}

interface ChoiceData {
  question?: string
  choices?: Choice[]
}

function ChoiceNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as ChoiceData
  const updateNodeData = useEditorStore((state) => state.updateNodeData)

  const choices = nodeData.choices || []
  const question = nodeData.question || ''

  const handleQuestionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { question: e.target.value })
    },
    [id, updateNodeData]
  )

  const handleChoiceChange = useCallback(
    (choiceId: string, text: string) => {
      const updatedChoices = choices.map((choice) =>
        choice.id === choiceId ? { ...choice, text } : choice
      )
      updateNodeData(id, { choices: updatedChoices })
    },
    [id, choices, updateNodeData]
  )

  const handleAddChoice = useCallback(() => {
    const newChoice = {
      id: `choice_${Date.now()}`,
      text: `Option ${choices.length + 1}`,
    }
    updateNodeData(id, { choices: [...choices, newChoice] })
  }, [id, choices, updateNodeData])

  const handleRemoveChoice = useCallback(
    (choiceId: string) => {
      if (choices.length <= 2) return // Minimum 2 choices
      updateNodeData(id, {
        choices: choices.filter((c) => c.id !== choiceId),
      })
    },
    [id, choices, updateNodeData]
  )

  return (
    <Card
      className={`w-[280px] bg-card border-amber-500/30 shadow-lg transition-all ${
        selected ? 'ring-2 ring-amber-500' : ''
      }`}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-amber-500 !border-2 !border-background"
      />

      {/* Header */}
      <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <Diamond className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs text-amber-500 uppercase tracking-wide font-medium">
            Choice
          </span>
        </div>
        <button className="p-1 hover:bg-accent rounded">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-3">
        {/* Question input */}
        <Input
          value={question}
          onChange={handleQuestionChange}
          placeholder="What happens?"
          className="font-medium text-sm bg-transparent border-none p-0 h-auto focus-visible:ring-0"
        />

        {/* Choice options */}
        <div className="space-y-2">
          {choices.map((choice, index) => (
            <div key={choice.id} className="relative group">
              <div className="flex items-center gap-2 px-3 py-2 bg-accent/50 rounded-lg border border-border">
                <span className="text-xs text-amber-500 font-mono">
                  {String.fromCharCode(65 + index)}
                </span>
                <Input
                  value={choice.text}
                  onChange={(e) => handleChoiceChange(choice.id, e.target.value)}
                  className="flex-1 text-xs bg-transparent border-none p-0 h-auto focus-visible:ring-0"
                />
                {choices.length > 2 && (
                  <button
                    onClick={() => handleRemoveChoice(choice.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-destructive/20 rounded"
                  >
                    <X className="w-3 h-3 text-destructive" />
                  </button>
                )}
              </div>
              {/* Output handle for each choice */}
              <Handle
                type="source"
                position={Position.Right}
                id={choice.id}
                className="!w-3 !h-3 !bg-amber-500 !border-2 !border-background"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          ))}
        </div>

        {/* Add choice button */}
        <button
          onClick={handleAddChoice}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-dashed border-amber-500/30 text-amber-500 hover:bg-amber-500/10 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add choice
        </button>
      </CardContent>
    </Card>
  )
}

export const ChoiceNode = memo(ChoiceNodeComponent)
