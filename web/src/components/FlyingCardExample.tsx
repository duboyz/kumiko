'use client'

import { FlyingCardRow } from './FlyingCardRow'

// Example of how to easily customize the flying cards
export function FlyingCardExample() {
  const customCardImages = [
    {
      left: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg', // Team meeting
      right: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg', // Analytics
      leftAlt: 'Team collaboration',
      rightAlt: 'Data analytics',
    },
    {
      left: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg', // Planning
      right: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg', // Growth
      leftAlt: 'Strategic planning',
      rightAlt: 'Business growth',
    },
    {
      left: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg', // Technology
      right: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg', // Innovation
      leftAlt: 'Modern technology',
      rightAlt: 'Innovation hub',
    },
  ]

  return (
    <div>
      {customCardImages.map((images, index) => (
        <FlyingCardRow
          key={index}
          index={index}
          leftImage={images.left}
          rightImage={images.right}
          leftAlt={images.leftAlt}
          rightAlt={images.rightAlt}
        />
      ))}
    </div>
  )
}
