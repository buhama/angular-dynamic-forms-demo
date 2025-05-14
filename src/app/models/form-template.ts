export type FieldType =
  | 'textbox'
  | 'dropdown'
  | 'checkbox'
  | 'email'
  | 'number'
  | 'date';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: { key: string; value: string }[];
  conditional?: {
    questionId: string;
    operator: '==' | '!=' | '>' | '<';
    value: any;
  };
}

export interface FormSection {
  id: string;
  title: string;
  fields: { [fieldId: string]: FormField };
}

export interface FormTemplate {
  id: string;
  matterId: string;
  title: string;
  sections: { [sectionId: string]: FormSection };
  createdBy: string;
  createdAt: string; // ISO
}
