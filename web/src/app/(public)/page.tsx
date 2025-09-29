'use client'

import { Heading } from '@/stories/atoms/Heading/Heading'

export default function Home() {
  return (
    <div>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Kumiko</h1>
        <p className="text-gray-600 dark:text-gray-300">Your modern booking and business management platform.</p>

        <Heading level={1}>Heading æ</Heading>
      </div>
    </div>
  )
}
