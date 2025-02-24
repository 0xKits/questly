"use client"

import { Badge } from "@/components/ui/badge"

interface TopicsStepProps {
  topics: string[]
  onUpdateTopics: (topics: string[]) => void
}

const STEM_TOPICS = {
  Science: ["Chemistry", "Biology", "Physics", "Earth Science", "Astronomy"],
  Technology: ["Programming", "Robotics", "Artificial Intelligence", "Web Development", "Cybersecurity"],
  Engineering: ["Mechanical", "Electrical", "Civil", "Chemical", "Aerospace"],
  Mathematics: ["Algebra", "Geometry", "Calculus", "Statistics", "Number Theory"],
}

export default function TopicsStep({ topics, onUpdateTopics }: TopicsStepProps) {
  const toggleTopic = (topic: string) => {
    if (topics.includes(topic)) {
      onUpdateTopics(topics.filter((t) => t !== topic))
    } else {
      onUpdateTopics([...topics, topic])
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">Select the STEM topics that relate to your project</div>
      {Object.entries(STEM_TOPICS).map(([category, categoryTopics]) => (
        <div key={category} className="space-y-2">
          <h3 className="font-medium">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {categoryTopics.map((topic) => (
              <Badge
                key={topic}
                variant={topics.includes(topic) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTopic(topic)}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

