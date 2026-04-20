'use client'

import { useState, useEffect } from 'react'

const DEADLINE = new Date('2026-08-02T00:00:00Z')

function getCountdownText() {
  const now = new Date()
  const diff = DEADLINE - now

  if (diff <= 0) return null

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

  if (days > 60) {
    const months = Math.round(days / 30.44)
    return `approximately ${months} month${months !== 1 ? 's' : ''} away`
  }

  if (days > 14) {
    const weeks = Math.round(days / 7)
    return `approximately ${weeks} week${weeks !== 1 ? 's' : ''} away`
  }

  return `${days} day${days !== 1 ? 's' : ''} away`
}

export function EuAiActCountdown() {
  const [text, setText] = useState(null)

  useEffect(() => {
    setText(getCountdownText())
  }, [])

  if (!text) return null
  return <span> — {text}.</span>
}
