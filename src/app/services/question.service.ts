import { Injectable } from '@angular/core';
import { DropdownQuestion } from '../models/question-dropdown';
import { TextboxQuestion } from '../models/question-textbox';
import { QuestionBase } from '../models/question-base';
import { of } from 'rxjs';

@Injectable()
export class QuestionService {
  getQuestions() {
    const questions: QuestionBase<string>[] = [
      new TextboxQuestion({
        key: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        order: 1,
      }),
    ];
    return of(questions);
  }
}