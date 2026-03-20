import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import ProgressBar from "../../components/ui/ProgressBar";
import ScoreRing from "../../components/ui/ScoreRing";
import Icon from "../../components/ui/Icon";
import Loader from "../../components/ui/Loader";
import axios from "axios";

const scoreColor = (s) =>
  s >= 80 ? "#38e2c7" : s >= 65 ? "#fbbf24" : "#f97aad";

export default function ResumePage() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [sectionData, setSectionData] = useState([]);
  const [tipsData, setTipsData] = useState([]);
  const [overallScore, setOverallScore] = useState("");
  const [overallLabel, setOverallLabel] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleClick = () => {
    document.getElementById("fileUpload").click();
  };
  const handleAnalyze = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("resume_file", file);
    setLoading(true);
    try {
      setAnalyzed(false);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/resume/upload/",
        formData,
      );
      setOverallScore(response.data.analysis_result.overall_score);
      setOverallLabel(response.data.analysis_result.overall_label);
      setSectionData(response.data.analysis_result.section_analysis);
      setTipsData(response.data.analysis_result.top_improvements);
      setAnalyzed(true);
      setLoading(false);
      alert("resume analyzed successfully");
    } catch (error) {
      console.log(error);
      setAnalyzed(false);
      setLoading(false);
      alert("resume analysis failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="Resume Analyzer"
        subtitle="Upload your resume for AI-powered ATS scoring and improvement suggestions."
      />

      {/* Upload Zone */}
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`drop-zone mb-6 ${dragging ? "border-accent/60 bg-accent/5" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-accent mb-4 mx-auto w-fit"
            >
              <Icon name="upload" size={48} />
            </motion.div>
            <h3 className="font-display font-bold text-xl mb-2">
              Drop your resume here
            </h3>
            <p className="text-muted text-sm mb-6">
              Supports PDF, DOC, DOCX · Max 5MB
            </p>
            <Button size="sm">Browse Files</Button>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              id="fileUpload"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files[0];
                if (f) setFile(f);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card padding="p-5" className="mb-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent3/12 border border-accent3/30 flex items-center justify-center text-accent3 flex-shrink-0">
                <Icon name="file" size={22} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{file.name}</p>
                <p className="text-xs text-muted mt-0.5">
                  PDF · {file.size || "2.1 MB"} · Uploaded just now
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={handleAnalyze} loading={loading}>
                  <Icon name="bolt" size={15} />
                  {!loading && "Analyze Resume"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setAnalyzed(false);
                  }}
                >
                  Remove
                </Button>
              </div>
            </Card>

            {loading && <Loader text="Analyzing your resume with AI..." />}

            <AnimatePresence>
              {analyzed && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Score + Sections */}
                  <div className="grid lg:grid-cols-5 gap-5 mb-5">
                    {/* Score Ring */}
                    <Card className="lg:col-span-2 flex flex-col items-center justify-center gap-5 py-8">
                      <ScoreRing
                        score={overallScore}
                        size={140}
                        label="Overall Score"
                      />
                      <div className="text-center">
                        <p className="font-display font-bold text-base mb-2">
                          {overallLabel}
                        </p>
                        <p className="text-muted text-xs leading-relaxed max-w-[200px]">
                          Strong structure detected. ATS optimization and
                          quantifiable metrics will push this to 90+.
                        </p>
                      </div>
                    </Card>

                    {/* Section Analysis */}
                    <Card className="lg:col-span-3" padding="p-6">
                      <h3 className="font-display font-bold text-base mb-5">
                        Section Analysis
                      </h3>
                      <div className="flex flex-col gap-4">
                        {sectionData.map((s, i) => (
                          <motion.div
                            key={s.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }}
                          >
                            <div className="flex justify-between mb-1.5 text-xs">
                              <span className="font-medium">{s.label}</span>
                              <span
                                className="font-bold"
                                style={{ color: scoreColor(s.score) }}
                              >
                                {s.score}%
                              </span>
                            </div>
                            <ProgressBar
                              pct={s.score}
                              color={scoreColor(s.score)}
                            />
                            <p className="text-muted text-xs mt-1.5 leading-relaxed">
                              {s.feedback}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Improvement Tips */}
                  <Card padding="p-6">
                    <h3 className="font-display font-bold text-base mb-5">
                      🎯 Top Improvement Suggestions
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {tipsData.map((tip, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex gap-3 p-4 bg-surface2 border border-white/[0.07] rounded-xl"
                        >
                          <span className="text-accent font-bold font-display text-sm flex-shrink-0">
                            {i + 1}.
                          </span>
                          <p className="text-muted text-xs leading-relaxed">
                            {tip}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
