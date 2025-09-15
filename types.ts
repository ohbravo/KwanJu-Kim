
export type QuestionType = 'multiple-choice' | 'text' | 'textarea';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
}

export interface SurveyStepConfig {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface StepAnswers {
  [questionId: string]: string;
}

export interface SurveyData {
  [stepId: string]: StepAnswers;
}
