'use client'

import { useState, useEffect, ReactNode } from 'react'

interface ClientOnlyWrapperProps {
    children: ReactNode
    fallback?: ReactNode
}

export function ClientOnlyWrapper({ children, fallback = null }: ClientOnlyWrapperProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return <>{fallback}</>
    }

    return <>{children}</>
}
