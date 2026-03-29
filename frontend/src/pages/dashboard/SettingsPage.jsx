import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import FormInput from '../../components/ui/FormInput'
import Toggle from '../../components/ui/Toggle'
import Icon from '../../components/ui/Icon'

const api = axios.create({ baseURL: 'http://127.0.0.1:8000/api' })
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
})

const PREFS = [
  { key: 'email_notifications', label: 'Email Notifications', desc: 'Get updates on progress and AI recommendations' },
  { key: 'weekly_report', label: 'Weekly Progress Report', desc: 'Receive a weekly summary of your learning activity' },
  { key: 'dark_mode', label: 'Dark Mode', desc: 'Use the dark color theme (recommended)' },
  { key: 'ai_suggestions', label: 'AI Suggestions', desc: 'Get personalized tips from the AI engine' },
]
const PLAN_DETAILS = {
  free: { name: 'Free Plan', desc: '5 roadmaps/month · 20 interview questions · Basic analytics' },
  pro: { name: 'Pro Plan', desc: 'Unlimited roadmaps & prep · Advanced AI performance analytics' },
  enterprise: { name: 'Plus Plan', desc: 'Everything in Pro · Direct human mentor support' }
}

export default function SettingsPage() {
  const { user, setUser, subscriptionPlan } = useApp()
  const [profile, setProfile] = useState({ name: '', email: '', current_role: '', company: '' })
  const [prefs, setPrefs] = useState({ email_notifications: true, weekly_report: true, dark_mode: true, ai_suggestions: true })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile/', authHeader())
        setProfile({
          name: res.data.name,
          email: res.data.email,
          current_role: res.data.current_role,
          company: res.data.company
        })
        setPrefs(res.data.preferences)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const setP = (k) => (e) => setProfile({ ...profile, [k]: e.target.value })
  const togglePref = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/user/profile/', { ...profile, preferences: prefs }, authHeader())
      setSaved(true)
      setUser({ ...user, ...profile })
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await api.delete('/user/profile/', authHeader())
        localStorage.clear()
        window.location.href = '/login'
      } catch (err) {
        console.error('Delete failed:', err)
      }
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your profile, preferences, and account settings." />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card padding="p-7" delay={0.1}>
          <div className="flex items-center gap-4 mb-7">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xl font-bold flex-shrink-0">
              {profile.name.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-display font-bold text-lg">{profile.name || 'User'}</p>
              <p className="text-muted text-sm">{profile.email}</p>
              <button className="text-xs text-accent mt-1 hover:underline cursor-pointer">Change Avatar</button>
            </div>
          </div>

          <h3 className="font-display font-bold text-base mb-5">Profile Information</h3>
          <div className="flex flex-col gap-4">
            <FormInput label="Full Name" value={profile.name} onChange={setP('name')} />
            <FormInput label="Email Address" value={profile.email} onChange={setP('email')} type="email" disabled />
            <FormInput label="Current Role" value={profile.current_role} onChange={setP('current_role')} />
            <FormInput label="Company" value={profile.company} onChange={setP('company')} />

            <motion.div animate={saved ? { scale: [1, 1.02, 1] } : {}}>
              <Button onClick={handleSave} loading={saving} className="w-full justify-center">
                {saved ? <><Icon name="check" size={15} /> Saved Successfully!</> : 'Save Changes'}
              </Button>
            </motion.div>
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          <Card padding="p-7" delay={0.2}>
            <h3 className="font-display font-bold text-base mb-6">Preferences</h3>
            <div className="flex flex-col gap-5">
              {PREFS.map(({ key, label, desc }) => (
                <Toggle
                  key={key}
                  on={prefs[key]}
                  onClick={() => togglePref(key)}
                  label={label}
                  description={desc}
                />
              ))}
            </div>
          </Card>

          <Card padding="p-6" delay={0.3}>
            <h3 className="font-display font-bold text-base mb-4">Subscription</h3>
            <div className="bg-accent/8 border border-accent/20 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{PLAN_DETAILS[subscriptionPlan]?.name || 'Free Plan'}</span>
                <span className="text-xs text-accent bg-accent/15 px-2.5 py-1 rounded-full font-semibold">Current</span>
              </div>
              <p className="text-muted text-xs">{PLAN_DETAILS[subscriptionPlan]?.desc || PLAN_DETAILS.free.desc}</p>
            </div>
            <Button 
              onClick={() => navigate('/dashboard/pricing')}
              className="w-full justify-center"
            >
              Update Plan
            </Button>
          </Card>

          <Card padding="p-6" delay={0.4}>
            <h3 className="font-display font-bold text-base mb-4 text-accent3">Danger Zone</h3>
            <div className="flex gap-3">
              <button 
                onClick={handleDelete}
                className="text-xs font-medium text-accent3 border border-accent3/30 px-4 py-2 rounded-lg hover:bg-accent3/5 transition-colors cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}


