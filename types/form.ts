export type QuestionType = 'choice' | 'text' | 'textarea' | 'multiselect';

export interface QuestionOption {
  label: string;
  value: string;
  keyHint?: string;
  color?: string;
  description?: string;
}

export interface FormQuestion {
  id: number;
  section: string;
  sectionBadge?: string;
  title: string;
  subtitle?: string;
  type: QuestionType;
  options?: QuestionOption[];
  required: boolean;
  placeholder?: string;
  helpText?: string;
  dependsOn?: {
    questionId: number;
    value: string;
  };
}

export interface FormAnswers {
  [key: number]: string;
}
