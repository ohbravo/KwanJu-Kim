import React from 'react';

interface ProgressBarProps {
  progress: number;
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, currentStep, totalSteps }) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-brand-blue">진행률</span>
        <span className="text-sm font-medium text-brand-blue">{currentStep} / {totalSteps}</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
        <div 
          className="bg-brand-blue h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;