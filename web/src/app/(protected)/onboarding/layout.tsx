'use client'

import { Toaster } from 'sonner'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            {children}
            <Toaster richColors position="top-right" />
        </div>
    )
}

