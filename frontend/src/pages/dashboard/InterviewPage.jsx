import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INTERVIEW_QUESTIONS } from "../../data/mockData";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import FormInput, { FormSelect } from "../../components/ui/FormInput";
import TagInput from "../../components/ui/TagInput";
import Badge from "../../components/ui/Badge";
import Icon from "../../components/ui/Icon";
import Loader from "../../components/ui/Loader";
import axios from "axios";

const COMPANY_TYPES = [
  "Startup",
  "Mid-size",
  "FAANG",
  "Fortune 500",
  "Consulting Firm",
  "DevOps Engineer"
];
const EXP_LEVELS = ["0-1 year", "1-3 years", "3-5 years", "5+ years"];

export default function InterviewPage() {
  const [form, setForm] = useState({
    target_role: "Senior Frontend Developer",
    company: "FAANG",
    experience_level: "3-5 years",
  });
  const [stack, setStack] = useState(["React", "TypeScript", "Node.js"]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [activeQ, setActiveQ] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    form.tech_stack = stack;
    try {
      setGenerated(false);
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/interview/generate_qns/",
        form,
      );
      setInterviewQuestions(response.data.interview_questions);
      setGenerated(true);
      setLoading(false);
       console.log(interviewQuestions)
      alert("questions generated successfully");
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div>
      <PageHeader
        title="Interview Prep"
        subtitle="Generate a tailored interview plan based on your target role and company."
      />

      {/* Config */}
      <form onSubmit={handleSubmit}>
        <Card padding="p-7" className="mb-7">
          <div className="grid md:grid-cols-3 gap-5 mb-5">
            <FormInput
              label="Target Role"
              placeholder="Senior Frontend Developer"
              value={form.target_role}
              onChange={set("role")}
            />
            <FormSelect
              label="Company Type"
              options={COMPANY_TYPES}
              value={form.company}
              onChange={set("company")}
            />
            <FormSelect
              label="Experience"
              options={EXP_LEVELS}
              value={form.experience_level}
              onChange={set("exp")}
            />
          </div>
          <div className="mb-6">
            <label className="text-xs font-medium text-muted uppercase tracking-wider block mb-2">
              Tech Stack{" "}
              <span className="text-accent normal-case">
                · press Enter to add
              </span>
            </label>
            <TagInput
              tags={stack}
              setTags={setStack}
              placeholder="Add technology..."
            />
          </div>
          <Button
            type="submit"
          >
            <Icon name="bolt" size={15} />
            Generate Interview Plan
          </Button>
        </Card>
      </form>

      {loading && <Loader text="Building your personalized question bank..." />}

      <AnimatePresence>
        {generated && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-xl">
                Question Bank — {form.role}
              </h2>
              <div className="flex items-center gap-2">
                {["Easy", "Medium", "Hard"].map((l) => (
                  <Badge key={l} label={l} variant={l} />
                ))}
              </div>
            </div>

            {/* Questions */}
            <div className="flex flex-col gap-3">
              {generated && interviewQuestions.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-surface border border-white/[0.07] rounded-xl overflow-hidden hover:border-accent/30 transition-colors duration-300"
                >
                  <button
                    type="button"
                    onClick={() => setActiveQ(activeQ === i ? null : i)}
                    className="flex items-start gap-3 w-full p-5 text-left hover:bg-surface2 transition-colors"
                  >
                    <Badge label={q.level} variant={q.level} />
                    <span className="text-xs text-muted bg-surface2 border border-white/[0.07] rounded-md px-2 py-1 whitespace-nowrap mt-0.5">
                      {q.category}
                    </span>
                    <span className="text-sm flex-1 leading-relaxed mt-0.5">
                      {q.q}
                    </span>
                    <motion.div
                      animate={{ rotate: activeQ === i ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-1 flex-shrink-0"
                    >
                      <Icon name="chevron" size={15} className="text-muted" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {activeQ === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-surface2 border-t border-white/[0.07] px-5 py-4">
                          <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">
                            Model Answer
                          </p>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {q.ans}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
