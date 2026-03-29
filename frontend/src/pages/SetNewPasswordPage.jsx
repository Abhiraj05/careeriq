import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import FormInput from "../components/ui/FormInput";
import axios from "axios";

export default function SetNewPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!uid || !token) {
      alert("Invalid or missing reset token");
      navigate("/login");
    }
  }, [uid, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/set-new-password/",
        {
          uid,
          token,
          newpassword: password,
        }
      );
      setMessage(response.data.message || "Password reset successfully.");
      setLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Failed to reset password");
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
            Set New Password
          </h2>
          <p className="text-muted text-sm">
            Please enter your new password below
          </p>
        </div>

        <div className="bg-surface border border-white/[0.07] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FormInput
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FormInput
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {!loading && "Update Password"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
