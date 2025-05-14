import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionBase } from '../models/question-base';

@Component({
  selector: 'app-dynamic-form-question',
  standalone: true,
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['../app.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class DynamicFormQuestionComponent {
  @Input() question!: QuestionBase<string>;
  @Input() form!: FormGroup;

  get isValid() {
    const control = this.form.get(this.question.key);
    return control ? control.valid : true;
  }

  get isDirty() {
    const control = this.form.get(this.question.key);
    return control ? control.dirty : false;
  }

  get errorMessage() {
    const control = this.form.get(this.question.key);
    if (!control || !control.errors || !this.isDirty) return '';

    if (control.errors['required']) {
      return `${this.question.label} is required`;
    }
    return '';
  }
}
