import { useState, useMemo, useCallback } from 'react'
import questions from './questions.json'
import LESSONS_DATA from './data/lessonsData'
import Sidebar from './components/Sidebar'
import QuizCard from './components/QuizCard'
import FilterBar from './components/FilterBar'
import CourseHome from './components/CourseHome'
import ScoreScreen from './components/ScoreScreen'
import LessonList from './components/LessonList'
import LessonViewer from './components/LessonViewer'

// Pedagogical order: foundations → valuation → deal modeling → advanced → interview prep
const subcategoryList = [
  'Accounting',
  'Enterprise / Equity Value',
  'DCF',
  'Valuation',
  'LBO Model',
  'Credit Analysis',
  'Merger Model',
  'Restructuring / Distressed M&A',
  'Private Equity',
  'Capital Markets',
  'Brain Teasers',
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── localStorage ─────────────────────────────────────────────────────────────
function loadStudiedIds() {
  try { return new Set(Object.keys(JSON.parse(localStorage.getItem('capital_studied') || '{}'))) }
  catch { return new Set() }
}
function saveStudiedIds(ids) {
  const obj = {}; ids.forEach(id => { obj[id] = true })
  localStorage.setItem('capital_studied', JSON.stringify(obj))
}
function loadQuizResults() {
  try { return JSON.parse(localStorage.getItem('capital_quiz_results') || '{}') }
  catch { return {} }
}
function saveQuizResults(r) { localStorage.setItem('capital_quiz_results', JSON.stringify(r)) }

function loadReadLessons() {
  try { return new Set(Object.keys(JSON.parse(localStorage.getItem('capital_lessons_read') || '{}'))) }
  catch { return new Set() }
}
function saveReadLessons(ids) {
  const obj = {}; ids.forEach(id => { obj[id] = true })
  localStorage.setItem('capital_lessons_read', JSON.stringify(obj))
}

export default function App() {
  // ─── Navigation ─────────────────────────────────────────────────────────────
  const [view, setView]               = useState('home')         // 'home' | 'module'
  const [activeModule, setActiveModule] = useState(null)
  const [activeTab, setActiveTab]     = useState('lessons')      // 'lessons' | 'practice' | 'quiz'
  const [quizComplete, setQuizComplete] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // ─── Lesson navigation ───────────────────────────────────────────────────────
  const [activeLessonIndex, setActiveLessonIndex] = useState(null) // null = list, number = lesson

  // ─── Practice / Quiz session ─────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex]             = useState(0)
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [isShuffled, setIsShuffled]                 = useState(false)
  const [shuffledOrder, setShuffledOrder]           = useState([])
  const [quizSession, setQuizSession]               = useState({ ratings: new Map() })
  const [sessionQuestions, setSessionQuestions]     = useState([])

  // ─── Persisted state ─────────────────────────────────────────────────────────
  const [studiedIds, setStudiedIds]   = useState(loadStudiedIds)
  const [quizResults, setQuizResults] = useState(loadQuizResults)
  const [readLessons, setReadLessons] = useState(loadReadLessons)

  // ─── Computed ────────────────────────────────────────────────────────────────
  const moduleStats = useMemo(() =>
    subcategoryList.reduce((acc, sub) => {
      const qs = questions.filter(q => q.subcategory === sub)
      const studied = qs.filter(q => studiedIds.has(q.id)).length
      const lessonData = LESSONS_DATA[sub]
      const totalLessons = lessonData?.lessons?.length || 0
      const completedLessons = totalLessons > 0
        ? lessonData.lessons.filter(l => readLessons.has(l.id)).length
        : 0
      acc[sub] = {
        total: qs.length,
        studied,
        studyPct: Math.round((studied / qs.length) * 100),
        quizResult: quizResults[sub] || null,
        totalLessons,
        completedLessons,
        lessonPct: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        hasLessons: totalLessons > 0,
      }
      return acc
    }, {}), [studiedIds, quizResults, readLessons])

  const filtered = useMemo(() => {
    if (!activeModule) return []
    let qs = questions.filter(q => q.subcategory === activeModule)
    if (selectedDifficulty !== 'All') qs = qs.filter(q => q.difficulty === selectedDifficulty)
    return qs
  }, [activeModule, selectedDifficulty])

  const activeList = useMemo(() => {
    if (isShuffled && shuffledOrder.length > 0) return shuffledOrder
    return filtered
  }, [filtered, isShuffled, shuffledOrder])

  const availableDifficulties = useMemo(() => {
    if (!activeModule) return ['All']
    const qs = questions.filter(q => q.subcategory === activeModule)
    return ['All', ...new Set(qs.map(q => q.difficulty))]
  }, [activeModule])

  const questionList  = activeTab === 'quiz' ? sessionQuestions : activeList
  const currentQuestion = questionList[currentIndex] || null
  const isFirst = currentIndex === 0
  const isLast  = currentIndex === questionList.length - 1

  const studiedInView = useMemo(
    () => activeList.filter(q => studiedIds.has(q.id)).length,
    [activeList, studiedIds]
  )

  const currentLessonData = activeModule ? LESSONS_DATA[activeModule] : null

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleOpenModule = useCallback((sub, tab = null) => {
    const hasLessons = !!LESSONS_DATA[sub]
    const defaultTab = tab || (hasLessons ? 'lessons' : 'practice')
    setActiveModule(sub)
    setView('module')
    setActiveTab(defaultTab)
    setCurrentIndex(0)
    setSelectedDifficulty('All')
    setIsShuffled(false)
    setShuffledOrder([])
    setQuizSession({ ratings: new Map() })
    setQuizComplete(false)
    setActiveLessonIndex(null)
    setSessionQuestions(questions.filter(q => q.subcategory === sub))
  }, [])

  const handleGoHome = useCallback(() => {
    setView('home')
    setActiveModule(null)
    setQuizComplete(false)
    setActiveLessonIndex(null)
  }, [])

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab)
    setCurrentIndex(0)
    setQuizSession({ ratings: new Map() })
    setQuizComplete(false)
    setActiveLessonIndex(null)
    if (tab === 'quiz') {
      setSessionQuestions(questions.filter(q => q.subcategory === activeModule))
    }
  }, [activeModule])

  // Lesson handlers
  const handleSelectLesson = useCallback((index) => setActiveLessonIndex(index), [])
  const handleBackToList   = useCallback(() => setActiveLessonIndex(null), [])

  const handleLessonComplete = useCallback(() => {
    if (activeLessonIndex === null || !currentLessonData) return
    const lesson = currentLessonData.lessons[activeLessonIndex]
    if (lesson) {
      setReadLessons(prev => {
        const next = new Set(prev)
        next.add(lesson.id)
        saveReadLessons(next)
        return next
      })
    }
    const isLastLesson = activeLessonIndex >= currentLessonData.lessons.length - 1
    if (isLastLesson) {
      // Done with all lessons → switch to practice
      setActiveLessonIndex(null)
      setActiveTab('practice')
    } else {
      setActiveLessonIndex(activeLessonIndex + 1)
    }
  }, [activeLessonIndex, currentLessonData])

  const handleLessonPrev = useCallback(() => {
    setActiveLessonIndex(i => Math.max(0, i - 1))
  }, [])

  // Practice handlers
  const handleDifficultyChange = useCallback((diff) => {
    setSelectedDifficulty(diff)
    setCurrentIndex(0)
    setIsShuffled(false)
    setShuffledOrder([])
  }, [])

  const handleShuffle = useCallback(() => {
    if (!isShuffled) { setShuffledOrder(shuffle(filtered)); setIsShuffled(true) }
    else { setIsShuffled(false); setShuffledOrder([]) }
    setCurrentIndex(0)
  }, [isShuffled, filtered])

  const handleReset = useCallback(() => {
    if (!activeModule) return
    setStudiedIds(prev => {
      const moduleIds = new Set(questions.filter(q => q.subcategory === activeModule).map(q => q.id))
      const next = new Set([...prev].filter(id => !moduleIds.has(id)))
      saveStudiedIds(next)
      return next
    })
    setCurrentIndex(0)
    setIsShuffled(false)
    setShuffledOrder([])
  }, [activeModule])

  const handleStudyNext = useCallback(() => {
    if (currentQuestion) {
      setStudiedIds(prev => {
        const next = new Set(prev)
        next.add(currentQuestion.id)
        saveStudiedIds(next)
        return next
      })
    }
    if (!isLast) setCurrentIndex(i => i + 1)
  }, [currentQuestion, isLast])

  const handleStudyPrev = useCallback(() => setCurrentIndex(i => Math.max(i - 1, 0)), [])

  // Quiz handlers
  const handleQuizRate = useCallback((rating) => {
    if (!currentQuestion) return
    const newRatings = new Map(quizSession.ratings)
    newRatings.set(currentQuestion.id, rating)
    if (isLast) {
      const gotIt         = [...newRatings.values()].filter(r => r === 'got_it').length
      const stillLearning = [...newRatings.values()].filter(r => r === 'still_learning').length
      const result = { gotIt, stillLearning, total: sessionQuestions.length, completedAt: new Date().toISOString() }
      setQuizResults(prev => { const n = { ...prev, [activeModule]: result }; saveQuizResults(n); return n })
      setQuizSession({ ratings: newRatings })
      setQuizComplete(true)
    } else {
      setQuizSession({ ratings: newRatings })
      setCurrentIndex(i => i + 1)
    }
  }, [currentQuestion, isLast, quizSession.ratings, activeModule, sessionQuestions.length])

  // ─── Tabs config ─────────────────────────────────────────────────────────────
  const hasLessons = activeModule ? !!LESSONS_DATA[activeModule] : false
  const tabs = hasLessons ? ['lessons', 'practice', 'quiz'] : ['practice', 'quiz']
  const tabLabels = { lessons: 'Learn', practice: 'Practice', quiz: 'Quiz' }

  const progressPct = activeTab === 'practice' && activeList.length > 0
    ? Math.round((studiedInView / activeList.length) * 100)
    : 0

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div id="progress-line" style={{ width: `${progressPct}%` }} />

      <Sidebar
        open={sidebarOpen}
        view={view}
        activeModule={activeModule}
        moduleStats={moduleStats}
        subcategoryList={subcategoryList}
        onGoHome={handleGoHome}
        onSelectModule={sub => handleOpenModule(sub)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header
          className="flex items-center gap-3 px-5 h-11 shrink-0"
          style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
        >
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="p-1 rounded btn-press shrink-0"
            style={{ color: 'var(--text-muted)', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          {view === 'home' ? (
            <span className="font-mono text-[11px] font-semibold tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>Capital</span>
          ) : (
            <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{activeModule}</span>
          )}

          {view === 'module' && (
            <div className="ml-auto flex items-center gap-0.5 p-0.5 rounded-full" style={{ background: 'var(--accent-light)', border: '1px solid var(--border)' }}>
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className="px-3 py-0.5 rounded-full text-[11px] font-medium btn-press"
                  style={{
                    background: activeTab === tab ? 'var(--accent)' : 'transparent',
                    color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                    transition: 'all 0.15s var(--ease-smooth)',
                  }}
                >
                  {tabLabels[tab]}
                </button>
              ))}
            </div>
          )}

          {view === 'home' && (
            <span className="ml-auto font-mono text-[11px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
              {questions.length} questions
            </span>
          )}
          {view === 'module' && (
            <span className="font-mono text-[11px] tabular-nums ml-2 shrink-0" style={{ color: 'var(--text-muted)' }}>
              {questionList.length}q
            </span>
          )}
        </header>

        {/* Main content */}
        {view === 'home' ? (
          <CourseHome subcategoryList={subcategoryList} moduleStats={moduleStats} onOpenModule={handleOpenModule} />
        ) : activeTab === 'lessons' ? (
          activeLessonIndex === null ? (
            <LessonList
              moduleData={currentLessonData}
              readLessons={readLessons}
              onSelectLesson={handleSelectLesson}
              onStartPractice={() => handleTabChange('practice')}
            />
          ) : (
            <LessonViewer
              lesson={currentLessonData.lessons[activeLessonIndex]}
              lessonIndex={activeLessonIndex}
              totalLessons={currentLessonData.lessons.length}
              isRead={readLessons.has(currentLessonData.lessons[activeLessonIndex]?.id)}
              onComplete={handleLessonComplete}
              onPrev={handleLessonPrev}
              onNext={() => setActiveLessonIndex(i => Math.min(i + 1, currentLessonData.lessons.length - 1))}
              onBackToList={handleBackToList}
            />
          )
        ) : (
          <>
            {activeTab === 'practice' && (
              <FilterBar
                mode="practice"
                difficulties={availableDifficulties}
                selectedDifficulty={selectedDifficulty}
                onDifficultyChange={handleDifficultyChange}
                isShuffled={isShuffled}
                onShuffle={handleShuffle}
                onReset={handleReset}
                answered={studiedInView}
                total={activeList.length}
              />
            )}
            {activeTab === 'quiz' && !quizComplete && (
              <div className="px-6 py-2 shrink-0 flex items-center" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Rate each answer after revealing</span>
                <span className="ml-auto font-mono text-[10px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {quizSession.ratings.size} / {sessionQuestions.length} rated
                </span>
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center justify-start pt-10">
              {quizComplete ? (
                <ScoreScreen
                  result={quizResults[activeModule]}
                  moduleName={activeModule}
                  onGoHome={handleGoHome}
                  onStudyAgain={() => handleTabChange('practice')}
                  onRetakeQuiz={() => handleTabChange('quiz')}
                />
              ) : currentQuestion ? (
                <QuizCard
                  mode={activeTab === 'quiz' ? 'quiz' : 'study'}
                  question={currentQuestion}
                  index={currentIndex}
                  total={questionList.length}
                  onNext={handleStudyNext}
                  onPrev={handleStudyPrev}
                  onRate={handleQuizRate}
                  isFirst={isFirst}
                  isLast={isLast}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-1" style={{ color: 'var(--text-muted)' }}>
                  <p className="text-base" style={{ letterSpacing: '-0.01em' }}>No questions match your filters.</p>
                  <p className="text-xs uppercase tracking-widest font-mono">Try a different difficulty</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
