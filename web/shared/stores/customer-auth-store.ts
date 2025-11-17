import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserSdto } from '../types/user.types'

interface CustomerAuthStore {
    customer: UserSdto | null
    isAuthenticated: boolean

    // Actions
    setCustomer: (customer: UserSdto | null) => void
    clearCustomer: () => void
}

export const useCustomerAuthStore = create<CustomerAuthStore>()(
    persist(
        (set) => ({
            customer: null,
            isAuthenticated: false,

            setCustomer: (customer) => {
                set({ customer, isAuthenticated: !!customer })
            },

            clearCustomer: () => {
                set({ customer: null, isAuthenticated: false })
            },
        }),
        {
            name: 'customer-auth-storage',
        }
    )
)

