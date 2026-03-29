import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import CheckoutModal from '../../components/ui/CheckoutModal'
import { useApp } from '../../context/AppContext'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    desc: 'For individual students starting their career journey.',
    features: [
      '5 AI-generated roadmaps/month',
      '20 interview prep questions',
      'Basic progress tracking',
      'Community access'
    ],
    buttonText: 'Get Started',
    buttonVariant: 'secondary',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    desc: 'The best option for serious job seekers and learners.',
    features: [
      'Unlimited roadmaps & prep',
      'Advanced AI performance analytics',
      'AI Resume generation/analysis',
      'Priority 1:1 AI support',
      'Ad-free experience'
    ],
    highlight: true,
    buttonText: 'Get Started',
    buttonVariant: 'primary',
  },
  {
    id: 'enterprise',
    name: 'Plus',
    price: 49,
    desc: 'For those who want exclusive mentorship and tools.',
    features: [
      'Everything in Pro',
      'Direct human mentor support',
      'Enterprise career networks',
      'Custom placement portal',
      'Exclusive webinars'
    ],
    buttonText: 'Upgrade Now',
    buttonVariant: 'secondary',
  }
]

export default function PricingPage() {
  const { subscriptionPlan } = useApp()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const isShowCheckout = !!selectedPlan

  return (
    <div>
      <PageHeader 
        title="Scaling Your Potential" 
        subtitle="Choose the perfect plan to accelerate your career with AI-driven intelligence."
      />

      <div className="grid lg:grid-cols-3 gap-8 mt-10">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card 
              padding="p-0" 
              className={`h-full overflow-hidden transition-all duration-300 ${plan.highlight ? 'border-accent/40 shadow-2xl shadow-accent/10 ring-1 ring-accent/20' : 'hover:border-white/20'}`}
            >
              {plan.highlight && (
                <div className="bg-accent text-white text-[10px] font-bold uppercase tracking-widest text-center py-1.5 font-display">
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold font-display">{plan.name}</h3>
                  <div className={`p-2 rounded-xl bg-white/5 ${plan.highlight ? 'text-accent' : 'text-muted'}`}>
                    <Icon name={plan.id === 'pro' ? 'zap' : plan.id === 'free' ? 'compass' : 'layers'} size={20} />
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold font-display">${plan.price}</span>
                  <span className="text-muted text-sm font-medium">/month</span>
                </div>

                <p className="text-muted text-sm leading-relaxed mb-8 h-10">
                  {plan.desc}
                </p>

                <div className="space-y-4 mb-10">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        <Icon name="check" size={14} className="text-accent" />
                      </div>
                      <span className="text-sm font-medium text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => subscriptionPlan !== plan.id && setSelectedPlan(plan)}
                  variant={subscriptionPlan === plan.id ? 'secondary' : plan.buttonVariant}
                  className={`w-full justify-center py-4 text-sm font-bold uppercase tracking-wider ${subscriptionPlan === plan.id ? 'opacity-50 cursor-default' : ''}`}
                >
                  {subscriptionPlan === plan.id ? 'Current Plan' : plan.buttonText}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="font-display font-medium text-lg mb-4">Have questions? We're here to help.</h3>
        <p className="text-muted text-sm mb-6 max-w-xl mx-auto">Our support team is available 24/7 to answer your questions and help you choose the best plan for your needs.</p>
        <button className="text-accent font-bold text-sm uppercase tracking-widest hover:underline cursor-pointer">
          Contact Support
        </button>
      </div>

      <CheckoutModal 
        isOpen={isShowCheckout} 
        onClose={() => setSelectedPlan(null)} 
        amount={selectedPlan?.price || 0}
        planId={selectedPlan?.id || 'free'}
      />
    </div>
  )
}
