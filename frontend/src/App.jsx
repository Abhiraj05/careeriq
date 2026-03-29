import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import SetNewPasswordPage from './pages/SetNewPasswordPage'
import ContactPage from './pages/ContactPage'
import DashboardLayout from './components/layout/DashboardLayout'
import OverviewPage from './pages/dashboard/OverviewPage'
import RoadmapPage from './pages/dashboard/RoadmapPage'
import InterviewPage from './pages/dashboard/InterviewPage'
import ResumePage from './pages/dashboard/ResumePage'
import AptitudePage from './pages/dashboard/AptitudePage'
import ProgressPage from './pages/dashboard/ProgressPage'
import SettingsPage from './pages/dashboard/SettingsPage'
import PricingPage from './pages/dashboard/PricingPage'
import { useApp } from './context/AppContext'

function ProtectedRoute({ children }) {
  const { user, userLoading } = useApp()
  const token = localStorage.getItem('access_token')

  if (userLoading) return null
  if (!user || !token) return <Navigate to="/login" replace />

  return children
}

export default function App() {
  return (
    <AppProvider>
      <Routes>
        {}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/setnewpassword" element={<SetNewPasswordPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<OverviewPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="interview" element={<InterviewPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="aptitude" element={<AptitudePage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="pricing" element={<PricingPage />} />
        </Route>

        {}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  )
}
