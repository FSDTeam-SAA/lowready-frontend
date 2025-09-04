// hooks/useFastDataLoading.ts
import { useState, useEffect, useCallback } from 'react'
import { getSession } from 'next-auth/react'

interface CacheEntry<T = unknown> {
  data: T
  timestamp: number
  expires: number
}

class FastCache {
  private cache = new Map<string, CacheEntry<unknown>>()
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expires: Date.now() + ttl
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data as T
  }

  clear(): void {
    this.cache.clear()
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }
}

// Global cache instance
const fastCache = new FastCache()

interface UseFastDataLoadingOptions {
  cacheKey: string
  cacheTTL?: number
  immediate?: boolean
}

export function useFastDataLoading<T>(
  fetchFunction: () => Promise<T>,
  options: UseFastDataLoadingOptions
) {
  const { cacheKey, cacheTTL, immediate = true } = options
  
  const [data, setData] = useState<T | null>(() => {
    // Try to get cached data immediately on mount
    return fastCache.get<T>(cacheKey)
  })
  const [loading, setLoading] = useState<boolean>(!data)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (force = false) => {
    // If we have cached data and not forcing, return it
    if (!force && fastCache.has(cacheKey)) {
      const cachedData = fastCache.get<T>(cacheKey)
      if (cachedData) {
        setData(cachedData)
        setLoading(false)
        return cachedData
      }
    }

    try {
      setLoading(true)
      setError(null)
      
      const result = await fetchFunction()
      
      // Cache the result
      fastCache.set(cacheKey, result, cacheTTL)
      setData(result)
      
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchFunction, cacheKey, cacheTTL])

  // Auto-fetch on mount if immediate and no cached data
  useEffect(() => {
    if (immediate && !data && !fastCache.has(cacheKey)) {
      fetchData()
    }
  }, [immediate, data, cacheKey, fetchData])

  const refetch = useCallback(() => fetchData(true), [fetchData])
  const clearCache = useCallback(() => {
    fastCache.clear()
  }, [])

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
    isFromCache: !!data && fastCache.has(cacheKey)
  }
}

// Specialized hook for subscription status
export function useFastSubscription() {
  return useFastDataLoading(
    async () => {
      const session = await getSession()
      if (!session?.accessToken) {
        throw new Error('No access token')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription/status`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return {
        isActive: result.isActive || false,
        plan: result.plan || null,
        expiresAt: result.expiresAt || null
      }
    },
    {
      cacheKey: 'subscription-status',
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      immediate: true
    }
  )
}

// Specialized hook for facilities
export function useFastFacilities() {
  return useFastDataLoading(
    async () => {
      const session = await getSession()
      if (!session?.accessToken) {
        throw new Error('No access token')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facility/my-facilities`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.data || []
    },
    {
      cacheKey: 'user-facilities',
      cacheTTL: 3 * 60 * 1000, // 3 minutes for more dynamic data
      immediate: false // Will be triggered manually
    }
  )
}