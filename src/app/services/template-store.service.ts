import { Injectable } from '@angular/core';
import { FormSection } from '../models/form-section';

const TEMPLATE_KEY = 'demo.template.v2';
const RESP_KEY = 'demo.responses.v2';

export interface FormTemplateLS {
  sections: FormSection[];
}

@Injectable({ providedIn: 'root' })
export class TemplateStoreService {
  saveTemplate(tpl: FormTemplateLS) {
    localStorage.setItem(TEMPLATE_KEY, JSON.stringify(tpl));
  }

  loadTemplate(): FormTemplateLS | null {
    try {
      return JSON.parse(localStorage.getItem(TEMPLATE_KEY) || 'null');
    } catch {
      return null;
    }
  }

  saveResponse(obj: any) {
    const arr = this.loadResponses();
    arr.push(obj);
    localStorage.setItem(RESP_KEY, JSON.stringify(arr));
  }

  loadResponses(): any[] {
    try {
      return JSON.parse(localStorage.getItem(RESP_KEY) || '[]');
    } catch {
      return [];
    }
  }
}
