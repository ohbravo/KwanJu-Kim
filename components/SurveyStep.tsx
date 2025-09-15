import React from 'react';
import type { SurveyStepConfig, StepAnswers } from '../types';

interface SurveyStepProps {
  step: SurveyStepConfig;
  answers: StepAnswers;
  onAnswerChange: (stepId: string, questionId: string, answer: string) => void;
}

const SurveyStep: React.FC<SurveyStepProps> = ({ step, answers, onAnswerChange }) => {
  
  const renderQuestion = (question: SurveyStepConfig['questions'][0]) => {
    const { id, type, text, options } = question;
    const value = answers[id] || '';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onAnswerChange(step.id, id, e.target.value);
    }
    
    const handleRadioChange = (option: string) => {
        onAnswerChange(step.id, id, option);
    }

    switch (type) {
      case 'multiple-choice':
        return (
          <div key={id}>
            <label className="block text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">{text}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options?.map(option => (
                <label
                  key={option}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    value === option 
                    ? 'bg-blue-50 dark:bg-blue-900/50 border-brand-blue ring-2 ring-brand-blue' 
                    : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                >
                  <input
                    type="radio"
                    name={`${step.id}-${id}`}
                    value={option}
                    checked={value === option}
                    onChange={() => handleRadioChange(option)}
                    className="hidden"
                  />
                  <span className="text-slate-800 dark:text-slate-200">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 'text':
        return (
          <div key={id}>
            <label htmlFor={`${step.id}-${id}`} className="block text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">{text}</label>
            <input
              id={`${step.id}-${id}`}
              type="text"
              value={value}
              onChange={handleInputChange}
              placeholder="답변을 입력해주세요..."
              className="w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue dark:focus:border-brand-blue outline-none transition text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        );
      case 'textarea':
        return (
          <div key={id}>
            <label htmlFor={`${step.id}-${id}`} className="block text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">{text}</label>
            <textarea
              id={`${step.id}-${id}`}
              value={value}
              onChange={handleInputChange}
              rows={4}
              placeholder="자세한 내용을 입력해주세요..."
              className="w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue dark:focus:border-brand-blue outline-none transition text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-blue">{step.title}</h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400">{step.description}</p>
      <div className="mt-8 space-y-8">
        {step.questions.map(renderQuestion)}
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SurveyStep;