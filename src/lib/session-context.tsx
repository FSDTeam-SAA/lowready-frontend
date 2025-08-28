"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  accessToken?: string
}

interface SessionContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean  // Made required instead of optional
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Calculate isAuthenticated based on user state
  const isAuthenticated = !!user

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("demo-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const BASE_URL_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
      const response = await fetch(`${BASE_URL_API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          const userData = {
            id: result.data.user.id,
            name: result.data.user.name,
            email: result.data.user.email,
            accessToken: result.data.accessToken,
          }
          setUser(userData)
          localStorage.setItem("demo-user", JSON.stringify(userData))
          return true
        }
      }
    } catch (error) {
      console.error("Auth error:", error)
    }

    // Fallback for demo - create a demo user
    const demoUser = {
      id: "demo-user",
      name: "Olivia Rhye",
      email: email,
      accessToken: "demo-token",
    }
    setUser(demoUser)
    localStorage.setItem("demo-user", JSON.stringify(demoUser))
    return true
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("demo-user")
  }

  return (
    <SessionContext.Provider value={{ user, isLoading, isAuthenticated, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}