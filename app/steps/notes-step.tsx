"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface NotesStepProps {
  notes: string
  onUpdateNotes: (value: string) => void
}

export default function NotesStep({ notes, onUpdateNotes }: NotesStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add any special requirements or notes for your project..."
          value={notes}
          onChange={(e) => onUpdateNotes(e.target.value)}
          className="min-h-[200px]"
        />
      </div>
      <div className="text-sm text-muted-foreground">
        Include any specific requirements, constraints, or goals for your project.
      </div>
    </div>
  )
}

