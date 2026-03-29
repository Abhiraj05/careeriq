import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import FormInput from "../components/ui/FormInput";
import axios from "axios";

export default function ContactPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert("Please fill in all details");
      return;
    }
    setLoading(true);
    setStatusMsg({ text: "", type: "" });
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/contact/",
        form
      );
      setStatusMsg({ text: response.data.message || "Message sent!", type: "success" });
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setStatusMsg({
        text: error.response?.data?.message || "Failed to send message.",
        type: "error",
      });
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
        className="w-full max-w-md relative mt-10 md:mt-0"
      >
        <div className="text-center mb-10">
          <Link
            to="/"
            className="font-display font-extrabold text-2xl gradient-text"
          >
            CareerIQ
          </Link>
          <h2 className="font-display font-bold text-2xl mt-5 mb-2">
            Contact Us
          </h2>
          <p className="text-muted text-sm border-white">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="bg-surface border border-white/[0.07] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FormInput
              label="Full Name"
              type="text"
              placeholder="Alex Johnson"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <FormInput
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted">Message</label>
              <textarea
                className="bg-bg border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors resize-none placeholder-muted/50"
                rows={4}
                placeholder="How can we help you?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>

            {statusMsg.text && (
              <p
                className={`text-sm text-center ${
                  statusMsg.type === "success" ? "text-green-500" : "text-red-500"
                }`}
              >
                {statusMsg.text}
              </p>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center py-3.5 mt-1 animate-glow"
            >
              {!loading && "Send Message"}
            </Button>
          </form>
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
