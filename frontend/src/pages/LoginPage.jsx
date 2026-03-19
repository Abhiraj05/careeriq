import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import FormInput from "../components/ui/FormInput";
import axios from "axios";


export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert("please fill the details");
    } else {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/login/",
          form,
        );
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        setForm({ email: "", password: "" });
        setLoading(false);
      } catch (error) {
        console.log(
          "Backend not available, proceeding with mock registration",
          error,
        );
        setLoading(false);
        alert("login failed");
      }
    }
  };
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <Link
            to="/"
            className="font-display font-extrabold text-2xl gradient-text"
          >
            CareerIQ
          </Link>
          <h2 className="font-display font-bold text-2xl mt-5 mb-2">
            Welcome back
          </h2>
          <p className="text-muted text-sm">Sign in to continue your journey</p>
        </div>

        <div className="bg-surface border border-white/[0.07] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FormInput
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <div className="flex justify-end">
              <span className="text-xs text-accent cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center py-3.5 mt-1"
            >
              {!loading && "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-accent font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-muted text-sm hover:text-[#e8e8f0] transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
