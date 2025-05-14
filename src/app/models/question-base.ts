export interface FieldCondition {
  questionId: string;
  operator: '==' | '!=' | '>' | '<';
  value: any;
}

export class QuestionBase<T = any> {
  id!: string;                // unique per form
  key = '';                   // form control name
  label = '';
  required = false;
  order = 1;
  controlType = 'textbox';    // 'textbox' | 'dropdown' | ...
  type?: string;              // html input type
  options?: { key: string; value: string }[]; // dropdown choices
  mapTo?: string;             // e.g. 'Client.Email'
  conditional?: FieldCondition;
  value?: T;                  // form control value

  constructor(init?: Partial<QuestionBase>) {
    Object.assign(this, init);
  }
}
