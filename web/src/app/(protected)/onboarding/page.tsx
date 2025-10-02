'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Building2, Scissors, Hotel } from 'lucide-react'
import { ContentContainer } from '@/components'
import { LocationTypeCard } from '@/components'

type LocationType = 'restaurant' | 'salon' | 'hotel'

interface LocationTypeOption {
  type: LocationType
  title: string
  description: string
  icon: React.ComponentType<any>
  available: boolean
}

const locationTypes: LocationTypeOption[] = [
  {
    type: 'restaurant',
    title: 'Restaurant',
    description: 'Manage your restaurant operations, menu, and orders',
    icon: Building2,
    available: true,
  },
  {
    type: 'salon',
    title: 'Salon',
    description: 'Manage appointments, services, and beauty treatments',
    icon: Scissors,
    available: false,
  },
  {
    type: 'hotel',
    title: 'Hotel',
    description: 'Manage bookings, rooms, and hospitality services',
    icon: Hotel,
    available: true,
  },
]

export default function OnboardingPage() {
  const [selectedType, setSelectedType] = useState<LocationType | null>(null)

  const handleContinue = () => {
    if (selectedType === 'restaurant') {
      // Navigate to restaurant setup step
      window.location.href = '/onboarding/restaurant'
    } else if (selectedType === 'hotel') {
      // Navigate to hotel setup step
      window.location.href = '/onboarding/hospitality'
    }
  }

  return (
    <ContentContainer>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome! Let's set up your business</h1>
        <p className="text-muted-foreground">Choose the type of business you want to manage with our platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {locationTypes.map(option => (
          <LocationTypeCard
            key={option.type}
            title={option.title}
            description={option.description}
            icon={option.icon}
            available={option.available}
            isSelected={selectedType === option.type}
            onClick={() => option.available && setSelectedType(option.type)}
          />
        ))}
      </div>

      <div className="text-center">
        <Button onClick={handleContinue} disabled={!selectedType} size="lg">
          Continue with {selectedType ? locationTypes.find(t => t.type === selectedType)?.title : 'Selection'}
        </Button>
      </div>
    </ContentContainer>
  )
}
