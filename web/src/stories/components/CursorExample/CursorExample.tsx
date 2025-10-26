'use client'

import { Button } from '@/components/ui/button'

export const CursorExample = () => {
  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold">Fancy Cursor Examples</h2>

      {/* Regular button - will show button text */}
      <Button data-cursor-text="Click me!">Regular Button</Button>

      {/* Custom cursor text */}
      <Button data-cursor-text="Explore">Learn More</Button>

      {/* Link with custom text */}
      <a
        href="#"
        className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        data-cursor-text="Visit"
      >
        External Link
      </a>

      {/* Text that will show the actual content */}
      <div className="p-4 border rounded">
        <p>Hover over the buttons above to see the fancy cursor in action!</p>
        <p className="text-sm text-gray-600 mt-2">
          The cursor will show custom text, scale effects, and smooth animations.
        </p>
      </div>
    </div>
  )
}
