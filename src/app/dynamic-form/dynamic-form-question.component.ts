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
    return this.form.controls[this.question.key].valid;
  }
}
