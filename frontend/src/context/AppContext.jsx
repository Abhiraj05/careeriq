import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userLoading, setUserLoading] = useState(true)
  const [roadmapProgress, setRoadmapProgress] = useState({})
  const [aptitudeScores, setAptitudeScores] = useState([])
  const [subscriptionPlan, setSubscriptionPlan] = useState(localStorage.getItem('career_iq_plan') || 'free')

  useEffect(() => {
    localStorage.setItem('career_iq_plan', subscriptionPlan)
  }, [subscriptionPlan])
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token')

      if (!token) {
        setUser(null)
        setUserLoading(false)
        return
      }

      try {
        const res = await fetch('http://127.0.0.1:8000/api/auth/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error('Invalid token')
        const data = await res.json()
        setUser(data)
      } catch (err) {
        console.warn('Backend not available or token invalid')
        setUser(null)
      } finally {
        setUserLoading(false)
      }
    }

    fetchUser()
  }, [])

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
  }

  const value = {
    user,
    setUser,
    userLoading,
    logout,
    roadmapProgress,
    setRoadmapProgress,
    aptitudeScores,
    setAptitudeScores,
    subscriptionPlan,
    setSubscriptionPlan,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
