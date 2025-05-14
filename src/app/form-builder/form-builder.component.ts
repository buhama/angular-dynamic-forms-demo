import { Component, Output, EventEmitter, signal, effect } from '@angular/core';
import { QuestionBase } from '../models/question-base';
import { TextboxQuestion } from '../models/question-textbox';
import { DropdownQuestion } from '../models/question-dropdown';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  templateUrl: './form-builder.component.html',
  styleUrls: ['../app.component.css'],
  imports: [DynamicFormComponent, CommonModule],
})
export class FormBuilderComponent {
  questions = signal<QuestionBase<any>[]>([
    new TextboxQuestion({
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      order: 1,
    })
  ]);

  adding = signal(false);
  newLabel = signal('');
  newType = signal<'textbox' | 'dropdown'>('textbox');

  @Output() questionsChange = new EventEmitter<QuestionBase<any>[]>();

  constructor() {
    effect(() => {
      this.questionsChange.emit(this.questions());
    });
  }

  startAdd() {
    this.adding.set(true);
    this.newLabel.set('');
    this.newType.set('textbox');
  }

  confirmAdd() {
    const label = this.newLabel().trim();
    if (!label) return;
    const type = this.newType();
    const key = `question${this.questions().length + 1}`;
    let newQuestion: QuestionBase<any>;
    if (type === 'textbox') {
      newQuestion = new TextboxQuestion({
        key,
        label,
        type: 'text',
        required: false,
        order: this.questions().length + 1,
      });
    } else {
      newQuestion = new DropdownQuestion({
        key,
        label,
        options: [{ key: 'option1', value: 'Option 1' }],
        order: this.questions().length + 1,
      });
    }
    this.questions.set([...this.questions(), newQuestion]);
    this.adding.set(false);
  }

  cancelAdd() {
    this.adding.set(false);
  }

  updateQuestionLabel(index: number, label: string) {
    const updated = [...this.questions()];
    updated[index] = { ...updated[index], label };
    this.questions.set(updated);
  }

  updateQuestionType(index: number, type: string) {
    const current = this.questions()[index];
    let updatedQuestion: QuestionBase<any>;
    if (type === 'textbox') {
      updatedQuestion = new TextboxQuestion({ ...current, controlType: 'textbox', type: 'text' });
    } else {
      updatedQuestion = new DropdownQuestion({ ...current, controlType: 'dropdown', options: [{key: 'option1', value: 'Option 1'}] });
    }
    const updated = [...this.questions()];
    updated[index] = updatedQuestion;
    this.questions.set(updated);
  }
}