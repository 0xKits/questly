"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"

interface ComponentsStepProps {
  components: string
  componentImage: File | null
  onUpdateComponents: (value: string) => void
  onUpdateImage: (file: File | null) => void
}

export default function ComponentsStep({
  components,
  componentImage,
  onUpdateComponents,
  onUpdateImage,
}: ComponentsStepProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpdateImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="components">List your components</Label>
        <Textarea
          id="components"
          placeholder="Enter the components you have (e.g., Arduino Uno, LED lights, resistors...)"
          value={components}
          onChange={(e) => onUpdateComponents(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label>Or upload an image of your components</Label>
        <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg">
          <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
          <Label htmlFor="image-upload" className="flex flex-col items-center gap-2 cursor-pointer">
            {previewUrl ? (
              <div className="relative w-full max-w-md">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Component preview"
                  className="w-full h-auto rounded-lg"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setPreviewUrl(null)
                    onUpdateImage(null)
                  }}
                >
                  Change
                </Button>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-full bg-muted">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                  <br />
                  PNG, JPG or GIF (max. 5MB)
                </div>
              </>
            )}
          </Label>
        </div>
      </div>
    </div>
  )
}

