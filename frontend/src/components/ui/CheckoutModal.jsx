import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useApp } from '../../context/AppContext'
import Button from './Button'
import Icon from './Icon'

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx')

const CheckoutForm = ({ amount, onCancel, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)


    setTimeout(() => {
      setLoading(false)
      onSuccess()
    }, 2800)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
        <label className="text-xs text-muted block mb-2 font-medium uppercase tracking-wider">Card Details</label>
        <div className="p-3 bg-black/20 rounded-lg border border-white/5 focus-within:border-accent transition-colors">
          <CardElement options={{
            style: {
              base: {
                fontSize: '15px',
                color: '#fff',
                '::placeholder': { color: '#6b7280' },
                fontFamily: 'Inter, sans-serif',
              },
              invalid: { color: '#ef4444' },
            },
          }} />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-accent3/10 border border-accent3/20 rounded-lg flex items-center gap-2 text-accent3 text-sm">
          <Icon name="alert-circle" size={16} />
          {error}
        </div>
      )}

      <div className="flex gap-3 mt-2">
        <Button 
          type="button" 
          variant="secondary" 
          className="flex-1 justify-center" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          loading={loading}
          className="flex-[2] justify-center"
        >
          {loading ? 'Processing...' : `Pay $${amount}`}
        </Button>
      </div>
    </form>
  )
}

export default function CheckoutModal({ isOpen, onClose, amount = 19, planId }) {
  const { setSubscriptionPlan } = useApp()
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-[#0d0d0f] border border-white/10 p-8 rounded-3xl shadow-2xl overflow-hidden"
        >
          {}
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-10 bg-[#0d0d0f] flex flex-col items-center justify-center text-center p-6"
              >
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6 text-accent">
                  <Icon name="check" size={40} />
                </div>
                <h2 className="text-2xl font-bold font-display mb-2">Payment Successful!</h2>
                <p className="text-muted mb-8">Welcome to CareerIQ Pro. Your account has been upgraded successfully.</p>
                <Button onClick={() => navigate('/dashboard')} className="w-full justify-center">Go to Dashboard</Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold font-display leading-tight">Secure Checkout</h2>
              <p className="text-muted text-sm mt-1">Upgrade to Pro Plan</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
              <Icon name="shield" size={24} />
            </div>
          </div>

          <div className="mb-8 p-4 bg-accent/5 rounded-2xl border border-accent/10 flex items-center justify-between">
            <span className="text-sm font-medium">Total Amount</span>
            <span className="text-2xl font-bold">${amount}</span>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm 
              amount={amount} 
              onCancel={onClose} 
              onSuccess={() => { setSuccess(true); if(planId) setSubscriptionPlan(planId); }} 
            />
          </Elements>

          <p className="text-[10px] text-center text-muted mt-6 uppercase tracking-widest font-bold opacity-50">
            Secure 256-bit SSL Encrypted Payment
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
