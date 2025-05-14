import { QuestionBase } from './question-base';

export interface FormSection {
  id: string;
  title: string;
  order: number;
  fields: QuestionBase[];
}
