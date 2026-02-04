'use client'

import { useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEditorStore } from '@/lib/store'
import {
  Download,
  Upload,
  FileJson,
  Trash2,
  MoreHorizontal,
  Save,
} from 'lucide-react'

export function TopBar() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { storyTitle, setStoryTitle, saveStory, loadStory, clearCanvas } =
    useEditorStore()

  const handleExportJSON = useCallback(() => {
    const story = saveStory()
    const blob = new Blob([JSON.stringify(story, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${story.title.replace(/\s+/g, '_')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [saveStory])

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const story = JSON.parse(e.target?.result as string)
          loadStory(story)
        } catch (error) {
          console.error('Failed to parse JSON file:', error)
          alert('Invalid JSON file')
        }
      }
      reader.readAsText(file)
      // Reset input
      event.target.value = ''
    },
    [loadStory]
  )

  const handleClear = useCallback(() => {
    if (
      window.confirm(
        'Are you sure you want to clear the canvas? This cannot be undone.'
      )
    ) {
      clearCanvas()
    }
  }, [clearCanvas])

  return (
    <div className="h-12 bg-card border-b border-border flex items-center justify-between px-4">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">N</span>
          </div>
          <span className="font-semibold text-sm hidden sm:inline">
            Narrative Editor
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <Input
          value={storyTitle}
          onChange={(e) => setStoryTitle(e.target.value)}
          className="w-48 h-8 text-sm bg-transparent border-none focus-visible:ring-1"
          placeholder="Story title..."
        />
      </div>

      {/* Center: View toggles (placeholder for future) */}
      <div className="hidden md:flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
          Canvas
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs text-muted-foreground"
          disabled
        >
          Timeline
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs text-muted-foreground"
          disabled
        >
          Graph
        </Button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleExportJSON}>
          <Save className="w-4 h-4 mr-1.5" />
          Save
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleExportJSON}>
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImportClick}>
              <Upload className="w-4 h-4 mr-2" />
              Import JSON
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleClear}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Canvas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Hidden file input for import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}
