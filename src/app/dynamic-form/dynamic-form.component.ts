import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { QuestionControlService } from '../services/question-control.service';
import { FormSection } from '../models/form-section';
import { QuestionBase } from '../models/question-base';
import { TemplateStoreService } from '../services/template-store.service';
import { DynamicFormQuestionComponent } from './dynamic-form-question.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormQuestionComponent],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['../app.component.css'],
})
export class DynamicFormComponent implements OnInit {
  @Input() sections: FormSection[] = [];
  form!: FormGroup;
  submitted?: any;

  constructor(
    private qcs: QuestionControlService,
    private store: TemplateStoreService
  ) {}

  ngOnInit() {
    if (!this.sections.length) {
      this.sections = this.store.loadTemplate()?.sections || [];
    }
    const allQs = this.sections.flatMap(s => s.fields);
    this.form = this.qcs.toFormGroup(allQs);

    // wire conditionals
    allQs.forEach(q => this.initConditional(q));
  }

  private initConditional(q: QuestionBase) {
    if (!q.conditional?.questionId) return;
    const depCtrl = this.form.get(q.conditional.questionId) as FormControl;
    const toggle = () => {
      const visible = depCtrl.value === q.conditional!.value;
      const ctrl = this.form.get(q.key)!;
      visible ? ctrl.enable() : (ctrl.reset(), ctrl.disable());
    };
    depCtrl.valueChanges.subscribe(toggle);
    toggle();
  }

  isVisible(q: QuestionBase) {
    if (!q.conditional?.questionId) return true;
    const depVal = this.form.get(q.conditional.questionId)?.value;
    return depVal === q.conditional.value;
  }

  submit() {
    this.submitted = this.form.getRawValue();
    this.store.saveResponse(this.submitted);
  }
}
