import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import Logo from "../assets/logo.png";

const FEATURES = [
  {
    icon: "map",
    title: "AI Career Roadmaps",
    desc: "Generate personalized, phase-by-phase roadmaps tailored to your target role and skill level.",
    color: "#7c6dfa",
  },
  {
    icon: "chat",
    title: "Interview Intelligence",
    desc: "Practice with AI-generated questions matched to your target company, role, and tech stack.",
    color: "#38e2c7",
  },
  {
    icon: "file",
    title: "Resume X-Ray",
    desc: "Deep ATS scoring, gap detection, and concrete improvement suggestions for your resume.",
    color: "#f97aad",
  },
  {
    icon: "brain",
    title: "Aptitude Engine",
    desc: "Adaptive tests across Quantitative, Logical, and Verbal domains with performance analytics.",
    color: "#fbbf24",
  },
  {
    icon: "chart",
    title: "Progress Intelligence",
    desc: "Unified dashboard tracking your readiness across all dimensions with trend analysis.",
    color: "#a78bfa",
  },
  {
    icon: "bolt",
    title: "AI-Powered Insights",
    desc: "Smart recommendations that evolve as you progress — always knowing what to focus on next.",
    color: "#34d399",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Set Your Target",
    desc: "Choose your dream role and current experience level.",
  },
  {
    n: "02",
    title: "Get Your Roadmap",
    desc: "Receive a custom AI-built plan with phases and milestones.",
  },
  {
    n: "03",
    title: "Practice & Improve",
    desc: "Use interviews, resume tools, and aptitude tests daily.",
  },
  {
    n: "04",
    title: "Land the Job",
    desc: "Track readiness until you're fully prepared and confident.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg font-body text-[#e8e8f0]">
      {}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 px-10 h-16 flex items-center justify-between">
        <img className="h-10" src={Logo} alt="" />

        <div className="hidden md:flex items-center gap-8">
          {[
            { name: "Features", id: "features" },
            { name: "How It Works", id: "how-it-works" },
            { name: "Pricing", id: "pricing" },
          ].map((item) => (
            <span
              key={item.id}
              onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-medium text-muted hover:text-[#e8e8f0] cursor-pointer transition-colors"
            >
              {item.name}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
            Sign In
          </Button>
          <Button size="sm" onClick={() => navigate("/register")}>
            Get Started
          </Button>
        </div>
      </nav>

      {}
      <section className="relative pt-40 pb-28 text-center overflow-hidden">
        {}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-accent/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-accent2/8 blur-[80px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {}
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-1.5 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent2 animate-shimmer" />
            <span className="text-xs font-semibold text-accent tracking-wide">
              Powered by Advanced AI
            </span>
          </div>

          <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[1.06] tracking-[-2px] max-w-4xl mx-auto mb-7 px-4">
            Your Career,
            <br />
            <span className="gradient-text">Intelligently Mapped</span>
          </h1>

          <p className="text-lg text-muted max-w-xl mx-auto mb-12 leading-relaxed px-4">
            AI-driven roadmaps, interview prep, resume analysis, and aptitude
            training — everything you need to land your dream job.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="animate-glow"
            >
              Start Free Trial
              <Icon name="arrow" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                const token = localStorage.getItem('access_token');
                if (token) navigate("/dashboard");
                else navigate("/login");
              }}
            >
              View Dashboard
            </Button>
          </div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center justify-center gap-16 mt-20 pt-12 border-t border-white/[0.07] max-w-lg mx-auto"
        >
          {[
            ["50K+", "Careers Mapped"],
            ["94%", "Success Rate"],
            ["200+", "Roles Covered"],
          ].map(([n, l]) => (
            <div key={l} className="text-center">
              <p className="font-display font-extrabold text-3xl gradient-text">
                {n}
              </p>
              <p className="text-xs text-muted mt-1">{l}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {}
      <section id="features" className="py-24 px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl tracking-tight mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Get Hired</span>
          </h2>
          <p className="text-muted max-w-md mx-auto">
            Six powerful AI modules working together toward one goal: your
            success.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="feature-card group"
            >
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-5 border"
                style={{
                  background: `${f.color}18`,
                  borderColor: `${f.color}40`,
                  color: f.color,
                }}
              >
                <Icon name={f.icon} size={22} />
              </div>
              <h3 className="font-display font-bold text-lg mb-3">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {}
      <section id="how-it-works" className="py-24 px-8 bg-surface border-y border-white/[0.07]">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-4xl tracking-tight text-center mb-16"
          >
            How It Works
          </motion.h2>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {STEPS.map((s) => (
              <motion.div key={s.n} variants={item} className="text-center">
                <p className="font-display font-extrabold text-5xl text-accent/20 mb-4">
                  {s.n}
                </p>
                <h3 className="font-display font-bold text-lg mb-3">
                  {s.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {}
      <section id="pricing" className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl tracking-tight mb-4">
              Flexible <span className="gradient-text">Pricing</span> for Everyone
            </h2>
            <p className="text-muted max-w-md mx-auto">
              Start for free and upgrade as you grow. No hidden fees.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { name: "Starter", price: "0", desc: "Perfect for students", features: ["5 Roadmaps/mo", "Basic Interviews", "Resume Score"] },
              { name: "Pro", price: "19", desc: "Best for job seekers", features: ["Unlimited Roadmaps", "AI Mock Interviews", "Deep Resume Analysis"], highlight: true },
              { name: "Plus", price: "49", desc: "For career pivoters", features: ["Priority Support", "Mentorship Access", "Placement Portal"] }
            ].map((plan) => (
              <div key={plan.name} className={`bg-surface border p-8 rounded-2xl transition-all ${plan.highlight ? 'border-accent shadow-xl shadow-accent/10' : 'border-white/[0.07]'}`}>
                <h3 className="font-display font-bold text-xl mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted text-sm">/mo</span>
                </div>
                <p className="text-sm text-muted mb-6">{plan.desc}</p>
                <div className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <Icon name="check" size={14} className="text-accent" /> {f}
                    </div>
                  ))}
                </div>
                <Button variant={plan.highlight ? "primary" : "ghost"} className="w-full justify-center" onClick={() => navigate("/register")}>
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-28 text-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto"
        >
          <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-6">
            Ready to <span className="gradient-text">Accelerate</span> Your
            Career?
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-10">
            Join thousands of professionals who landed their dream jobs with
            CareerIQ.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/register")}
            className="animate-glow"
          >
            Start Free — No Credit Card
            <Icon name="arrow" size={16} />
          </Button>
        </motion.div>
      </section>

      {}
      <footer className="border-t border-white/[0.07] px-10 py-8 flex items-center justify-between flex-wrap gap-4">
        {}

        <span className="text-muted text-sm">
          © 2025 CareerIQ Inc. — AI-powered career intelligence.
        </span>
        <div className="flex gap-6">
          {[{name:"Privacy",path:"#"}, {name:"Terms",path:"#"}, {name:"Contact",path:"/contact"}].map((l) => (
            <span
              key={l.name}
              onClick={() => l.path !== "#" && navigate(l.path)}
              className="text-muted text-sm hover:text-[#e8e8f0] cursor-pointer transition-colors"
            >
              {l.name}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
