import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { APTITUDE_QUESTIONS } from '../../data/mockData'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import ScoreRing from '../../components/ui/ScoreRing'
import Icon from '../../components/ui/Icon'

const CATEGORIES = [
  { id: 'Quant', label: 'Quantitative Aptitude', color: '#fbbf24', icon: 'search', subtopics: ['Arithmetic', 'Time & Work', 'Profit & Loss', 'Percentages', 'Ratio & Proportion', 'Speed, Time & Distance', 'Permutation & Combination', 'Probability'] },
  { id: 'Logical', label: 'Logical Reasoning', color: '#7c6dfa', icon: 'chat', subtopics: ['Patterns', 'Syllogisms', 'Sequences'] },
  { id: 'Verbal', label: 'Verbal Ability', color: '#38e2c7', icon: 'check', subtopics: ['Synonyms', 'Antonyms', 'Comprehension'] },
  { id: 'Data', label: 'Data Interpretation', color: '#f97aad', icon: 'home', subtopics: ['Bar Graphs', 'Pie Charts', 'Tables'] },
  { id: 'Technical', label: 'Technical Aptitude', color: '#9bdf5b', icon: 'menu', subtopics: ['Data Structures', 'Algorithms', 'DBMS'] }
];

export default function AptitudePage() {
  const [selectedMode, setSelectedMode] = useState('Practice');
  const [selectedMainCategory, setSelectedMainCategory] = useState('Quant');
  const [selectedSubtopic, setSelectedSubtopic] = useState('Arithmetic');
  const [numQuestions, setNumQuestions] = useState(20);
  const [isCustomNum, setIsCustomNum] = useState(false);
  const [difficulty, setDifficulty] = useState('Medium');
  const [timeLimitType, setTimeLimitType] = useState('Auto');
  const [customTime, setCustomTime] = useState(30);

  // Test state
  const [started, setStarted] = useState(false)
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const [loadingTest, setLoadingTest] = useState(false)
  const [apiQuestions, setApiQuestions] = useState([])
  const [currentTestId, setCurrentTestId] = useState(null)

  // Use Quant / Arithmetic as default mock questions
  const questions = apiQuestions.length > 0 ? apiQuestions : (APTITUDE_QUESTIONS['Quant'] || [])
  const q = questions[qIdx]

  const startTest = async () => {
    setLoadingTest(true);

    let apiTestMode = "Practice Mode";
    if (selectedMode === "Exam") apiTestMode = "Exam Mode";
    if (selectedMode === "Mock") apiTestMode = "Full Developer Mock";

    let apiCategory = selectedSubtopic;
    if (selectedMode === "Mock") apiCategory = "All Categories";

    try {
      const token = localStorage.getItem('token')
      const requestBody = {
        user_id: 1, // Fallback user id
        test_mode: apiTestMode,
        category: apiCategory,
        difficulty_level: difficulty === "Custom" ? "Medium" : difficulty,
        no_of_questions: numQuestions
      };

      const res = await fetch("http://127.0.0.1:8000/api/aptitude/start_test/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(requestBody)
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentTestId(data.id);
        // Replace mock data if backend sends real data
        if (data.question && Array.isArray(data.question)) {
          // Map generated questions to UI format exactly
          // Example mapping, customize based on true backend JSON structure
          /*
          setApiQuestions(data.question.map((item, idx) => ({
              id: item.id || idx,
              q: item.text,
              opts: item.options,
              ans: item.answer_index
          })))
          */
        }
      }
    } catch (err) {
      console.error("Failed to hit backend API, using mock question set", err);
    }

    setLoadingTest(false);
    setStarted(true); setQIdx(0); setSelected(null)
    setSubmitted(false); setScore(0); setFinished(false)
  }

  const handleSubmit = async () => {
    if (selected === null) return
    setSubmitted(true)

    const isCorrect = selected === q.ans;
    if (isCorrect) setScore((s) => s + 1)

    // Example submit to backend
    if (currentTestId && q.id) {
      try {
        const token = localStorage.getItem('token')
        await fetch("http://127.0.0.1:8000/api/aptitude/submit_answer/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            id: q.id,
            user_answer: q.opts[selected]
          })
        });
      } catch (err) {
        console.error("Failed to submit to backend", err);
      }
    }
  }

  const handleNext = () => {
    if (qIdx < questions.length - 1) {
      setQIdx((i) => i + 1)
      setSelected(null)
      setSubmitted(false)
    } else {
      setFinished(true)
    }
  }

  const reset = () => { setStarted(false); setFinished(false) }

  const optionClass = (i) => {
    if (!submitted) return `q-option${selected === i ? ' q-option-selected' : ''}`
    if (i === q.ans) return 'q-option q-option-correct'
    if (i === selected) return 'q-option q-option-wrong'
    return 'q-option opacity-40'
  }

  // ── Finished Screen ──
  if (finished) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-5xl mb-8"
        >🎉</motion.div>
        <ScoreRing score={Math.round((score / questions.length) * 100)} size={160} label="Final Score" />
        <h2 className="font-display font-bold text-2xl mt-8 mb-2">
          {score === questions.length ? 'Perfect Score!' : score >= questions.length / 2 ? 'Well Done!' : 'Keep Practicing!'}
        </h2>
        <p className="text-muted mb-8">
          You got {score} out of {questions.length} correct in {selectedSubtopic} reasoning.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={startTest}>Try Again</Button>
          <Button variant="ghost" onClick={reset}>Change Category</Button>
        </div>
      </motion.div>
    </div>
  )

  // ── Quiz Screen ──
  if (started) return (
    <div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <PageHeader title={`${selectedSubtopic} Aptitude`} subtitle={null} />
            <div className="flex flex-col items-end gap-2">
              <span className="text-sm text-muted">Question {qIdx + 1} of {questions.length}</span>
              <div className="w-32">
                <ProgressBar pct={((qIdx + 1) / questions.length) * 100} />
              </div>
            </div>
          </div>

          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={qIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card padding="p-7">
                  <p className="text-base font-medium leading-relaxed mb-7">{q?.q}</p>

                  <div className="flex flex-col gap-2.5 mb-7">
                    {q?.opts.map((opt, i) => (
                      <motion.div
                        key={i}
                        whileHover={!submitted ? { x: 4 } : {}}
                        onClick={() => !submitted && setSelected(i)}
                        className={optionClass(i)}
                      >
                        <span className="text-muted font-bold text-xs mr-3">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </motion.div>
                    ))}
                  </div>

                  {submitted ? (
                    <div className="flex items-center gap-3">
                      <div className={`flex-1 p-3.5 rounded-xl text-sm border ${selected === q.ans
                        ? 'bg-accent2/10 border-accent2/30 text-accent2'
                        : 'bg-accent3/10 border-accent3/30 text-accent3'
                        }`}>
                        {selected === q.ans
                          ? '✓ Correct! Well done.'
                          : `✗ Incorrect. Correct answer: ${q.opts[q.ans]}`}
                      </div>
                      <Button onClick={handleNext}>
                        {qIdx < questions.length - 1 ? 'Next' : 'View Results'}
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleSubmit} disabled={selected === null}>
                      Submit Answer
                    </Button>
                  )}
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )

  // ── Category Select Screen ──
  return (
    <div className="font-body text-[#e8e8f0]">
      <PageHeader
        title="Aptitude Practice"
        subtitle="Customize your test and sharpen your reasoning skills with targeted practice sessions."
      />

      <div className="flex flex-col xl:flex-row gap-6 mt-6">
        {/* Left Main Configuration Area */}
        <div className="flex-1 space-y-6">

          {/* Select Mode */}
          <Card padding="p-6">
            <h3 className="font-display font-medium text-lg mb-4 text-[#e8e8f0]">Select Mode</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Practice Mode */}
              <div
                onClick={() => setSelectedMode('Practice')}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${selectedMode === 'Practice' ? 'border-accent bg-accent/10' : 'border-white/[0.07] hover:border-white/20'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedMode === 'Practice' ? 'bg-accent text-white' : 'bg-surface2 text-muted'}`}>2</div>
                  <span className={`font-semibold text-sm ${selectedMode === 'Practice' ? 'text-[#e8e8f0]' : 'text-text'}`}>Practice Mode</span>
                </div>
                <p className="text-xs text-muted pl-9">No timer, Instant feedback</p>
              </div>

              {/* Exam Mode */}
              <div
                onClick={() => setSelectedMode('Exam')}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${selectedMode === 'Exam' ? 'border-accent bg-accent/10' : 'border-white/[0.07] hover:border-white/20'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-6 h-6 flex items-center justify-center text-muted`}>
                    <Icon name="target" size={16} />
                  </div>
                  <span className="font-semibold text-sm text-[#e8e8f0]">Exam Mode</span>
                </div>
                <p className="text-xs text-muted pl-9">Timer + score at the end</p>
              </div>

              {/* Full Mock Test */}
              <div
                onClick={() => setSelectedMode('Mock')}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${selectedMode === 'Mock' ? 'border-accent bg-accent/10' : 'border-white/[0.07] hover:border-white/20'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-6 h-6 flex items-center justify-center text-muted`}>
                    <Icon name="file" size={16} />
                  </div>
                  <span className="font-semibold text-sm text-[#e8e8f0]">Full Mock Test</span>
                </div>
                <p className="text-xs text-muted pl-9">Mixed categories</p>
              </div>
            </div>
          </Card>

          {/* Select Category & Subtopic */}
          <div className="border border-white/[0.07] rounded-2xl bg-surface overflow-hidden">
            <div className="p-6 pb-4">
              <h3 className="font-display font-medium text-lg text-[#e8e8f0]">Select Category &amp; Subtopic</h3>
            </div>

            <div className="flex flex-col md:flex-row border-t border-white/[0.07]">

              {/* Left Sidebar inside Card */}
              <div className="w-full md:w-[280px] border-r border-white/[0.07] bg-surface2/10">
                <div className="p-4 border-b border-white/[0.07]">
                  <div className="flex items-center gap-3 text-sm text-muted bg-surface2 px-3 py-2 rounded-xl border border-white/[0.05]">
                    <Icon name="search" size={14} />
                    <span className="opacity-60">Quantitative Aptitude</span>
                  </div>
                </div>
                <div className="py-2">
                  {CATEGORIES.map(cat => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedMainCategory(cat.id);
                        const firstSub = CATEGORIES.find(c => c.id === cat.id)?.subtopics[0];
                        if (firstSub) setSelectedSubtopic(firstSub);
                      }}
                      className={`flex items-center justify-between px-5 py-3 cursor-pointer transition-colors ${selectedMainCategory === cat.id ? 'bg-accent/10 border-l-[3px] border-l-accent' : 'hover:bg-white/5 border-l-[3px] border-l-transparent'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon name={cat.icon} size={15} className={selectedMainCategory === cat.id ? 'text-accent' : 'text-muted'} />
                        <span className={`text-[13px] ${selectedMainCategory === cat.id ? 'text-accent font-medium' : 'text-[#e8e8f0]'}`}>{cat.label}</span>
                      </div>
                      <Icon name="chevron" size={12} className={selectedMainCategory === cat.id ? 'text-accent rotate-90' : 'text-muted'} />
                    </div>
                  ))}
                  <div 
                    onClick={() => {
                      setSelectedMainCategory('Technical');
                      setSelectedSubtopic('Data Structures');
                    }}
                    className={`px-5 py-3 text-[13px] opacity-70 flex items-center justify-between mt-2 cursor-pointer transition-colors ${selectedMainCategory === 'Technical' ? 'bg-accent/10 border-l-[3px] border-l-accent opacity-100' : 'hover:bg-white/5 border-l-[3px] border-l-transparent text-muted'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon name="file" size={15} className={selectedMainCategory === 'Technical' ? 'text-accent' : ''} />
                      <span className={selectedMainCategory === 'Technical' ? 'text-accent font-medium' : ''}>(Optional) Technical Ap...</span>
                    </div>
                  </div>
                  <div 
                    onClick={() => {
                      setSelectedMainCategory('Technical');
                      setSelectedSubtopic('DBMS');
                    }}
                    className={`px-5 py-3 text-[13px] flex items-center justify-between cursor-pointer transition-colors ${selectedMainCategory === 'Technical' && selectedSubtopic === 'DBMS' ? 'bg-accent/10 border-l-[3px] border-l-accent' : 'hover:bg-white/5 border-l-[3px] border-l-transparent text-muted'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon name="bolt" size={15} className={selectedMainCategory === 'Technical' && selectedSubtopic === 'DBMS' ? 'text-accent' : ''} />
                      <span className={selectedMainCategory === 'Technical' && selectedSubtopic === 'DBMS' ? 'text-accent font-medium' : ''}>Technical Aptitude</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Subtopics Area */}
              <div className="flex-1 p-6">
                <div className="flex flex-wrap gap-2 mb-8">
                  {CATEGORIES.find(c => c.id === selectedMainCategory)?.subtopics.map(sub => (
                    <div
                      key={sub}
                      onClick={() => setSelectedSubtopic(sub)}
                      className={`px-4 py-2 text-[13px] rounded-lg cursor-pointer transition-colors border ${selectedSubtopic === sub ? 'bg-surface2 border-white/10 text-[#e8e8f0]' : 'border-transparent bg-white/[0.03] text-muted hover:bg-white/5'}`}
                    >
                      {sub}
                    </div>
                  ))}
                </div>

                {/* AI Recommendation Box */}
                <div className="bg-surface border border-white/[0.05] rounded-xl p-5 mb-2 mt-auto">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                        <Icon name="brain" size={12} className="text-accent" />
                      </div>
                      <span className="font-semibold text-sm text-[#e8e8f0]">AI Recommended Practice</span>
                    </div>
                    <Icon name="chevron" size={14} className="text-muted -rotate-90" />
                  </div>
                  <p className="text-[13px] text-muted pl-7">Based on your past performance, focus on Arithmetic and <br />Ratio &amp; Proportion for improvement.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="flex flex-col md:flex-row gap-6 mb-4 items-center">

            {/* No. Of Questions & Difficulty */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <h4 className="font-medium text-[13px] text-[#e8e8f0]">Select Number of Questions</h4>
                <h4 className="text-muted mx-1">|</h4>
                <h4 className="font-medium text-[13px] text-[#e8e8f0]">Difficulty</h4>
              </div>
            </div>

            <div className="flex items-center gap-6 ml-auto">
              <div className="flex items-center gap-3">
                <h4 className="font-medium text-[13px] text-[#e8e8f0]">Time Limit</h4>
                <div className="w-3.5 h-3.5 rounded-full bg-surface2 border border-white/10 flex items-center justify-center text-[10px] text-muted cursor-pointer hover:bg-white/10">i</div>
              </div>
            </div>
          </div>

          {/* Controls row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            <div className="flex gap-4 items-center">
              <div className="flex gap-2 p-1 bg-surface2 rounded-xl">
                {[5, 10, 20].map(num => (
                  <button
                    key={num}
                    onClick={() => { setNumQuestions(num); setIsCustomNum(false); }}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${numQuestions === num && !isCustomNum ? 'bg-surface text-[#e8e8f0] shadow-sm' : 'text-muted hover:text-[#e8e8f0]'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              {isCustomNum ? (
                <input 
                  type="number"
                  min="1"
                  max="100"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value) || 1)}
                  className="px-5 py-2.5 rounded-xl text-sm bg-surface text-[#e8e8f0] w-[100px] border border-accent/50 outline-none"
                  autoFocus
                />
              ) : (
                <button 
                  onClick={() => setIsCustomNum(true)}
                  className="px-5 py-2.5 rounded-xl text-sm bg-surface2 text-muted hover:text-[#e8e8f0]"
                >
                  Custom
                </button>
              )}
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex gap-2 p-1 bg-surface2 rounded-xl mr-4">
                {['Easy', 'Medium', 'Hard'].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setDifficulty(lvl)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${difficulty === lvl ? 'bg-surface text-[#e8e8f0] shadow-sm' : 'text-muted hover:text-[#e8e8f0]'}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setTimeLimitType('Auto')}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-xl text-sm min-w-[160px] transition-all ${timeLimitType === 'Auto' ? 'bg-surface2 border border-white/[0.05] text-[#e8e8f0]' : 'border border-transparent text-muted hover:bg-surface2'}`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${timeLimitType === 'Auto' ? 'bg-accent text-white' : 'bg-surface3'}`}>
                  {timeLimitType === 'Auto' && <Icon name="check" size={10} />}
                </div>
                <span className="flex-1 text-left">Auto <span className="text-muted">(20 mins)</span></span>
                {timeLimitType === 'Auto' && <Icon name="chevron" size={14} className="rotate-90" />}
              </button>

              <label 
                onClick={() => setTimeLimitType('Custom')}
                className="flex items-center gap-3 text-sm text-muted cursor-pointer hover:text-[#e8e8f0] transition-colors"
              >
                <div className="w-4 h-4 rounded border flex items-center justify-center border-white/20 bg-surface2">
                  {timeLimitType === 'Custom' && <div className="w-2 h-2 rounded-sm bg-accent"></div>}
                </div>
                Custom
              </label>

              {timeLimitType === 'Custom' && (
                <input 
                  type="number"
                  min="5"
                  max="180"
                  value={customTime}
                  onChange={(e) => setCustomTime(Number(e.target.value) || 5)}
                  className="px-3 py-2 rounded-lg text-sm bg-surface text-[#e8e8f0] w-[80px] border border-accent/50 outline-none ml-2"
                  placeholder="Mins"
                  autoFocus
                />
              )}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startTest}
            className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3.5 rounded-xl shadow-[0_8px_32px_rgba(124,109,250,0.2)] transition-all flex justify-center items-center gap-4 mt-2"
          >
            <span className="text-sm tracking-wide">Start Test</span>
            <span className="text-white/20">|</span>
            <span className="text-white/80 font-normal text-sm">{numQuestions} Questions</span>
            <span className="text-white/80 font-normal text-sm">{numQuestions} mins</span>
          </button>

        </div>


        {/* Right Sidebar - Insights Summary */}
        <div className="w-full xl:w-[320px]">
          <Card padding="p-6" className="h-full bg-surface">
            <h3 className="font-display font-medium text-[15px] mb-8 text-[#e8e8f0]">Insights Summary</h3>

            {/* Stat block 1 */}
            <div className="mb-10">
              <p className="text-[13px] text-muted mb-3">Avg Time per Question</p>
              <div className="flex items-baseline gap-2 text-white mb-2">
                <span className="text-[32px] font-display font-semibold tracking-tight">58</span>
                <span className="text-base text-white/80 font-medium">sec</span>
              </div>
              <p className="text-xs text-muted">(Benchmark: 1 min)</p>
            </div>

            {/* Stat block 2 */}
            <div className="mb-8 p-5 rounded-2xl bg-surface2/40 border border-white/[0.04]">
              <p className="text-[13px] text-muted mb-4">Previous Score in Arithmetic</p>
              <div className="text-[28px] font-display font-semibold text-white mb-4">65%</div>

              <div className="h-1.5 w-full bg-surface2 rounded-full mb-4 overflow-hidden flex">
                <div className="bg-accent/80 h-full rounded-full shadow-[0_0_10px_rgba(124,109,250,0.5)]" style={{ width: '65%' }}></div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-medium">
                <span className="text-muted">Weak</span>
                <span className="bg-surface2 px-2.5 py-1 rounded-md text-[#e8e8f0] border border-white/[0.05]">Beginner</span>
              </div>
            </div>

            {/* Stat block 3 */}
            <div className="p-5 rounded-2xl bg-surface2/40 border border-white/[0.04] mt-6">
              <p className="text-[13px] text-muted mb-4">Time Limit</p>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[15px] text-[#e8e8f0] font-medium">Auto <span className="text-muted font-normal text-sm">(20 mins)</span></div>
                <Icon name="chevron" size={12} className="text-muted -rotate-90" />
              </div>
              <p className="text-xs text-muted">Avg. 1 min per question</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}