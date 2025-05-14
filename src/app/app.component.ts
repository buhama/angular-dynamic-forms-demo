import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { QuestionBase } from './models/question-base';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DynamicFormComponent, FormBuilderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  tab: 'build' | 'view' | 'results' = 'build';
  questions: QuestionBase<any>[] = [];
  title = 'dynamic-forms-demo';

  // This method can be called by the form builder to update questions
  onQuestionsChange(questions: QuestionBase<any>[]) {
    this.questions = questions;
  }
}
