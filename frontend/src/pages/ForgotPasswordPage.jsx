import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import FormInput from "../components/ui/FormInput";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/reset-password/",
        { email }
      );
      setMessage(response.data.message || "Reset link sent to your email.");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-10">
          <Link
            to="/"
            className="font-display font-extrabold text-2xl gradient-text"
          >
            CareerIQ
          </Link>
          <h2 className="font-display font-bold text-2xl mt-5 mb-2">
            Reset Password
          </h2>
          <p className="text-muted text-sm">
            Enter your email to receive a password reset link
          </p>
        </div>

        <div className="bg-surface border border-white/[0.07] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FormInput
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {message && (
              <p className="text-green-500 text-sm text-center">{message}</p>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center py-3.5 mt-1"
            >
              {!loading && "Send Reset Link"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-accent font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
