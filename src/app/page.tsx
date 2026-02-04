'use client'

import { NarrativeCanvas } from '@/components/canvas/NarrativeCanvas'
import { LeftPanel } from '@/components/panels/LeftPanel'
import { TopBar } from '@/components/panels/TopBar'

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Node Library */}
        <LeftPanel />

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <NarrativeCanvas />
        </div>
      </div>
    </div>
  )
}
