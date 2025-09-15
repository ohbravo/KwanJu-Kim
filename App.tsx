import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import SurveyStep from './components/SurveyStep';
import ResultDisplay from './components/ResultDisplay';
import { SURVEY_STEPS } from './constants';
import type { SurveyData } from './types';
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from './components/icons/Icons';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState<SurveyData>({});
  const [isFinished, setIsFinished] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme as 'light' | 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const handleThemeChange = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const totalSteps = SURVEY_STEPS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleAnswerChange = useCallback((stepId: string, questionId: string, answer: string) => {
    setSurveyData(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        [questionId]: answer,
      },
    }));
  }, []);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleSubmit = () => {
    setIsFinished(true);
  };

  const isCurrentStepAnswered = useMemo(() => {
    const currentStepConfig = SURVEY_STEPS[currentStep];
    const currentStepAnswers = surveyData[currentStepConfig.id] || {};
    return currentStepConfig.questions.every(q => currentStepAnswers[q.id]?.trim() !== '' && currentStepAnswers[q.id] !== undefined);
  }, [currentStep, surveyData]);

  if (isFinished) {
    return <ResultDisplay surveyData={surveyData} theme={theme} onThemeChange={handleThemeChange} />;
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header theme={theme} onThemeChange={handleThemeChange} />
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <ProgressBar progress={progress} currentStep={currentStep + 1} totalSteps={totalSteps} />
            <div className="mt-8">
              <SurveyStep
                step={SURVEY_STEPS[currentStep]}
                answers={surveyData[SURVEY_STEPS[currentStep].id] || {}}
                onAnswerChange={handleAnswerChange}
              />
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-700/50 px-6 py-4 flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon />
              이전
            </button>
            {currentStep < totalSteps - 1 ? (
              <button
                onClick={handleNext}
                disabled={!isCurrentStepAnswered}
                className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-opacity-90 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
              >
                다음
                <ChevronRightIcon />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isCurrentStepAnswered}
                className="flex items-center gap-2 px-6 py-2 bg-brand-orange text-white rounded-md font-bold hover:bg-opacity-90 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                진단 결과 보기
                <SparklesIcon />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;