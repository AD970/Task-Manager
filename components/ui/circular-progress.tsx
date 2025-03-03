"use client"

import { useState, useEffect } from "react"

interface CircularProgressProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
}

export default function CircularProgress({
  progress = 15,
  size = 40,
  strokeWidth = 3,
  color = "#FFFFFF",
  backgroundColor = "#333333",
}: CircularProgressProps) {
  const [currentProgress, setCurrentProgress] = useState(0)

  // Animate the progress
  useEffect(() => {
    setCurrentProgress(progress)
  }, [progress])

  // Calculate the circle properties
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (currentProgress / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out",
          }}
        />
      </svg>

      {/* Optional: Add text in the center */}
      <div className="absolute text-xs text-black dark:text-white font-medium">{currentProgress}%</div>
    </div>
  )
}

