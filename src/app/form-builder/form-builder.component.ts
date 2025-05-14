import { Component, signal, effect } from '@angular/core';
import { nanoid } from 'nanoid';
import { QuestionBase } from '../models/question-base';
import { TextboxQuestion } from '../models/question-textbox';
import { DropdownQuestion } from '../models/question-dropdown';
import { TemplateStoreService } from '../services/template-store.service';
import { FormSection } from '../models/form-section';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { FormsModule } from '@angular/forms';
import { FieldCondition } from '../models/question-base';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent, FormsModule],
  templateUrl: './form-builder.component.html',
  styleUrls: ['../app.component.css'],
})
export class FormBuilderComponent {
  // sections state
  sections = signal<FormSection[]>([
    {
      id: 'sec1',
      title: 'Section 1',
      order: 1,
      fields: [],
    },
  ]);

  addingSec = signal(false);
  addingQ = signal<{ sec: number; type: 'textbox' | 'dropdown' } | null>(null);

  constructor(private store: TemplateStoreService) {
    // load saved template
    const saved = this.store.loadTemplate();
    if (saved) this.sections.set(saved.sections);

    // autosave
    effect(() => this.store.saveTemplate({ sections: this.sections() }));
  }

  /* ---------- section helpers ---------- */
  addSection() {
    const id = 'sec' + (this.sections().length + 1);
    this.sections.set([
      ...this.sections(),
      { id, title: 'New Section', order: this.sections().length + 1, fields: [] },
    ]);
  }

  removeSection(idx: number) {
    const s = [...this.sections()];
    s.splice(idx, 1);
    this.sections.set(s);
  }

  /* ---------- field helpers ---------- */
  startAddField(secIdx: number, type: 'textbox' | 'dropdown') {
    this.addingQ.set({ sec: secIdx, type });
  }

  confirmAddField(label: string, mapTo: string) {
    const cfg = this.addingQ();
    if (!cfg) return;
    const sections = [...this.sections()];
    const section = { ...sections[cfg.sec] };
    const id = nanoid(6);
    const base: Partial<QuestionBase> = {
      id,
      key: id,
      label,
      required: false,
      order: section.fields.length + 1,
      mapTo: mapTo || undefined,
    };
    const q =
      cfg.type === 'textbox'
        ? new TextboxQuestion({ ...base, controlType: 'textbox', type: 'text' })
        : new DropdownQuestion({
            ...base,
            controlType: 'dropdown',
            options: [{ key: 'opt1', value: 'Option 1' }],
          });
    section.fields = [...section.fields, q];
    sections[cfg.sec] = section;
    this.sections.set(sections);
    this.addingQ.set(null);
  }

  removeField(secIdx: number, qIdx: number) {
    const sections = [...this.sections()];
    const sec = { ...sections[secIdx] };
    sec.fields.splice(qIdx, 1);
    sections[secIdx] = sec;
    this.sections.set(sections);
  }

  /* ---------- conditional helpers ---------- */
  updateConditionalQuestionId(secIdx: number, qIdx: number, questionId: string | undefined) {
    const sections = [...this.sections()];
    const section = { ...sections[secIdx] };
    const field = { ...section.fields[qIdx] };

    if (questionId) {
      field.conditional = {
        questionId,
        operator: '==',
        value: field.conditional?.value || ''
      };
    } else {
      field.conditional = undefined;
    }

    section.fields[qIdx] = field;
    sections[secIdx] = section;
    this.sections.set(sections);
  }

  updateConditionalValue(secIdx: number, qIdx: number, value: any) {
    if (this.sections()[secIdx].fields[qIdx].conditional) {
      this.sections()[secIdx].fields[qIdx].conditional!.value = value;
      this.sections.set([...this.sections()]);
    }
  }
}
