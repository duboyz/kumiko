'use client'
import { useCurrentUser } from "@shared"
import { useRouter } from "next/router"
import { useEffect } from "react";

export default function GoodbyePage() {
    const { data: user } = useCurrentUser()

    if (user) window.location.reload()

    return (
        <div>
            <h1>Goodbye {user?.email}</h1>
        </div>
    )
}