
export interface Testimony {
  id: string;
  name: string;
  year: string;
  content: string;
  image: string;
  major: string;
}

export interface ApplicationFormData {
  fullName: string;
  phone: string;
  financialNeed: string;
  essay: string;
  academicRecordsBase64?: string;
  academicRecordsName?: string;
  academicRecordsMimeType?: string;
  identityDocumentBase64?: string;
  identityDocumentName?: string;
  identityDocumentMimeType?: string;
  financialDocumentsBase64?: string;
  financialDocumentsName?: string;
  financialDocumentsMimeType?: string;
  referenceLetterBase64?: string;
  referenceLetterName?: string;
  referenceLetterMimeType?: string;
}

export enum ApplicationStatus {
  IDLE = 'IDLE',
  SUBMITTING = 'SUBMITTING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface Application {
  id: string;
  fullName: string;
  phone: string;
  financialNeed: string;
  essay: string;
  academicRecordUrl?: string;
  identityDocUrl?: string;
  financialDocUrl?: string;
  referenceLetterUrl?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  submittedAt: any;
}

export interface Comment {
  id: string;
  name: string;
  role: string;
  text: string;
  date: string;
}
