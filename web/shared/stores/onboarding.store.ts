import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { OnboardingState, OnboardingStep } from '../types/onboarding.types'
import { ResponseBusinessDetails } from '../types/search.types'
import { CreateRestaurantCommand } from '../types/restaurant.types'
import { ParsedMenuStructure } from '../types/menu-structure.types'

interface OnboardingStore extends OnboardingState {
  // Actions
  setCurrentStep: (step: OnboardingStep) => void
  setSelectedBusiness: (business: ResponseBusinessDetails | null) => void
  setRestaurantData: (data: Partial<CreateRestaurantCommand> | null) => void
  setMenuData: (data: ParsedMenuStructure | null) => void
  setWebsiteData: (data: { subdomain: string; name: string } | null) => void
  markCompleted: () => void
  reset: () => void
  nextStep: () => void
  previousStep: () => void
}

const initialState: OnboardingState = {
  currentStep: OnboardingStep.Business,
  selectedBusiness: null,
  restaurantData: null,
  menuData: null,
  websiteData: null,
  isCompleted: false,
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentStep: step => set({ currentStep: step }),

      setSelectedBusiness: business => set({ selectedBusiness: business }),

      setRestaurantData: data => set({ restaurantData: data }),

      setMenuData: data => set({ menuData: data }),

      setWebsiteData: data => set({ websiteData: data }),

      markCompleted: () => set({ isCompleted: true }),

      reset: () => set(initialState),

      nextStep: () => {
        const { currentStep } = get()
        const steps = Object.values(OnboardingStep)
        const currentIndex = steps.indexOf(currentStep)
        if (currentIndex < steps.length - 1) {
          set({ currentStep: steps[currentIndex + 1] })
        }
      },

      previousStep: () => {
        const { currentStep } = get()
        const steps = Object.values(OnboardingStep)
        const currentIndex = steps.indexOf(currentStep)
        if (currentIndex > 0) {
          set({ currentStep: steps[currentIndex - 1] })
        }
      },
    }),
    {
      name: 'onboarding-storage',
    }
  )
)
