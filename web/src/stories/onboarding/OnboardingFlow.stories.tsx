import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RestaurantOnboarding } from './RestaurantOnboarding'
import { MenuImportWizard } from '@/stories/onboarding/MenuImportWizard'
import { WebsiteTemplateStep } from './WebsiteTemplateStep'
import { BusinessDetailsEditor, BusinessDetails } from './BusinessDetailsEditor'
import { BusinessHoursEditor, BusinessHours } from './BusinessHoursEditor'
import { SearchBusiness } from '@/components'
import { ResponseBusinessDetails } from '@shared'
import { ArrowRight, CheckCircle, Search, Upload, Globe, Clock, Building2 } from 'lucide-react'

// Mock data for demonstration
const mockBusinessData: ResponseBusinessDetails = {
  name: 'The Golden Spoon',
  formattedAddress: '123 Main Street, Oslo, Norway',
  vicinity: 'Oslo',
  formattedPhoneNumber: '+47 123 45 678',
  internationalPhoneNumber: '+47 123 45 678',
  website: 'https://goldenspoon.no',
  placeId: 'mock-place-id',
  businessStatus: 'OPERATIONAL',
  types: ['restaurant', 'food', 'establishment'],
  photos: [],
  reviews: [],
  rating: 4.5,
  userRatingsTotal: 150,
  geometry: {
    location: {
      lat: 59.9139,
      lng: 10.7522,
    },
  },
  openingHours: {
    openNow: true,
    weekdayText: [
      'Monday: 11:00 AM – 10:00 PM',
      'Tuesday: 11:00 AM – 10:00 PM',
      'Wednesday: 11:00 AM – 10:00 PM',
      'Thursday: 11:00 AM – 10:00 PM',
      'Friday: 11:00 AM – 11:00 PM',
      'Saturday: 10:00 AM – 11:00 PM',
      'Sunday: 10:00 AM – 9:00 PM',
    ],
  },
  // Parsed address components
  street: '123 Main Street',
  city: 'Oslo',
  state: '',
  postalCode: '0150',
  country: 'Norway',
  // Parsed business hours
  parsedBusinessHours: JSON.stringify({
    monday: { open: '11:00', close: '22:00' },
    tuesday: { open: '11:00', close: '22:00' },
    wednesday: { open: '11:00', close: '22:00' },
    thursday: { open: '11:00', close: '22:00' },
    friday: { open: '11:00', close: '23:00' },
    saturday: { open: '10:00', close: '23:00' },
    sunday: { open: '10:00', close: '21:00' },
  }),
}

const meta: Meta = {
  title: 'Onboarding/Complete Flow',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete onboarding flow demonstration showing all 5 steps and their components.',
      },
    },
  },
}

export default meta
type Story = StoryObj

export const CompleteOnboardingFlow: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [selectedBusiness, setSelectedBusiness] = useState<ResponseBusinessDetails>(mockBusinessData)
    const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null)
    const [businessHours, setBusinessHours] = useState<BusinessHours | null>(null)
    const [menuId, setMenuId] = useState<string | null>(null)

    const steps = [
      {
        id: 'search',
        title: 'Find Restaurant',
        description: 'Search and select your restaurant',
        icon: Search,
        component: (
          <div className="space-y-4">
            <SearchBusiness onBusinessSelect={setSelectedBusiness} selectedBusiness={selectedBusiness} />
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Demo:</strong> Restaurant is pre-selected for demonstration
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'details',
        title: 'Business Details',
        description: 'Review and edit business information',
        icon: Building2,
        component: (
          <BusinessDetailsEditor businessData={selectedBusiness} onChange={details => setBusinessDetails(details)} />
        ),
      },
      {
        id: 'hours',
        title: 'Business Hours',
        description: 'Set your opening hours',
        icon: Clock,
        component: (
          <BusinessHoursEditor
            weekdayText={selectedBusiness?.openingHours?.weekdayText}
            onChange={hours => setBusinessHours(hours)}
          />
        ),
      },
      {
        id: 'menu',
        title: 'Import Menu',
        description: 'Upload and process your menu',
        icon: Upload,
        component: (
          <MenuImportWizard
            restaurantId="demo-restaurant-id"
            onMenuCreated={id => {
              console.log('Menu created:', id)
              setMenuId(id)
              setCurrentStep(4)
            }}
            onSkip={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        ),
      },
      {
        id: 'website',
        title: 'Choose Website',
        description: 'Select website page templates',
        icon: Globe,
        component: (
          <WebsiteTemplateStep
            onTemplatesSelected={templates => {
              console.log('Selected templates:', templates)
              setCurrentStep(0) // Reset for demo
            }}
            onSkip={() => setCurrentStep(0)} // Reset for demo
            selectedMenuId={menuId || undefined}
          />
        ),
      },
    ]

    const currentStepData = steps[currentStep]

    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Restaurant Onboarding Flow</h1>
            <p className="text-xl text-muted-foreground">Complete setup process for new restaurants</p>
          </div>

          {/* Step Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Step Navigation</CardTitle>
              <CardDescription>Click on any step to jump to that part of the onboarding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = currentStep === index
                  const isCompleted = currentStep > index

                  return (
                    <Button
                      key={step.id}
                      variant={isActive ? 'default' : isCompleted ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentStep(index)}
                      className="flex items-center gap-2"
                    >
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      {step.title}
                      {isActive && <Badge variant="secondary">Current</Badge>}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Current Step */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <currentStepData.icon className="w-5 h-5" />
                Step {currentStep + 1}: {currentStepData.title}
              </CardTitle>
              <CardDescription>{currentStepData.description}</CardDescription>
            </CardHeader>
            <CardContent>{currentStepData.component}</CardContent>
          </Card>

          {/* Navigation Controls */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous Step
            </Button>
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Demo Info */}
          <Card>
            <CardHeader>
              <CardTitle>Demo Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                <strong>Current Step:</strong> {currentStep + 1} of {steps.length}
              </p>
              <p className="text-sm">
                <strong>Selected Business:</strong> {selectedBusiness?.name}
              </p>
              <p className="text-sm">
                <strong>Menu Imported:</strong> {menuId ? 'Yes' : 'No'}
              </p>
              <p className="text-sm text-muted-foreground">
                This is a demonstration of the complete onboarding flow. In the real application, each step would save
                data and progress through the actual setup process.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  },
}

export const IndividualComponents: Story = {
  render: () => {
    const [activeComponent, setActiveComponent] = useState('restaurant')

    const components = [
      {
        id: 'restaurant',
        title: 'Complete Restaurant Onboarding',
        description: 'Full 5-step onboarding flow',
        component: <RestaurantOnboarding onComplete={() => console.log('Onboarding completed')} />,
      },
      {
        id: 'menu',
        title: 'Menu Import Wizard',
        description: 'Complete menu import flow with annotation and processing',
        component: (
          <MenuImportWizard
            restaurantId="demo-restaurant-id"
            onMenuCreated={id => console.log('Menu created:', id)}
            onSkip={() => console.log('Skipped menu import')}
            onBack={() => console.log('Back clicked')}
          />
        ),
      },
      {
        id: 'website',
        title: 'Website Template Selection',
        description: 'Choose website page templates',
        component: (
          <WebsiteTemplateStep
            onTemplatesSelected={templates => console.log('Templates selected:', templates)}
            onSkip={() => console.log('Skipped website setup')}
            selectedMenuId="demo-menu-id"
          />
        ),
      },
    ]

    const currentComponent = components.find(c => c.id === activeComponent)

    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Individual Onboarding Components</h1>
            <p className="text-muted-foreground">Test each component individually</p>
          </div>

          {/* Component Selector */}
          <div className="flex flex-wrap gap-2 justify-center">
            {components.map(component => (
              <Button
                key={component.id}
                variant={activeComponent === component.id ? 'default' : 'outline'}
                onClick={() => setActiveComponent(component.id)}
              >
                {component.title}
              </Button>
            ))}
          </div>

          {/* Current Component */}
          {currentComponent && (
            <Card>
              <CardHeader>
                <CardTitle>{currentComponent.title}</CardTitle>
                <CardDescription>{currentComponent.description}</CardDescription>
              </CardHeader>
              <CardContent>{currentComponent.component}</CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  },
}
