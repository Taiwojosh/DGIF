import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Comment, ApplicationFormData } from '../../types';

export const firebaseService = {
  /**
   * Fetches approved reflections from Firestore
   */
  async fetchReflections(): Promise<Comment[]> {
    try {
      const reflectionsRef = collection(db, 'reflections');
      const q = query(
        reflectionsRef, 
        where('approved', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt as Timestamp;
        
        return {
          id: doc.id,
          name: data.name || 'Friend of Foundation',
          role: data.role || 'Friend',
          text: data.text || '',
          date: createdAt ? createdAt.toDate().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }) : 'Recent'
        };
      });
    } catch (error) {
      console.error('Error fetching reflections from Firebase:', error);
      throw error;
    }
  },

  /**
   * Adds a new reflection to Firestore
   */
  async addReflection(name: string, role: string, text: string): Promise<void> {
    try {
      const reflectionsRef = collection(db, 'reflections');
      await addDoc(reflectionsRef, {
        name: name.trim(),
        role: role.trim(),
        text: text.trim(),
        approved: true, // Auto-approve as per user preference for now
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding reflection to Firebase:', error);
      throw error;
    }
  },

  /**
   * Submits a scholarship application with file uploads
   */
  async submitApplication(formData: ApplicationFormData): Promise<void> {
    try {
      // 1. Upload files first
      const uploadFile = async (base64: string | undefined, name: string | undefined, type: string | undefined, folder: string) => {
        if (!base64 || !name) return null;
        const fileRef = ref(storage, `applications/${Date.now()}_${name}`);
        const snapshot = await uploadString(fileRef, base64, 'base64', {
          contentType: type
        });
        return await getDownloadURL(snapshot.ref);
      };

      const [academicUrl, identityUrl, financialUrl, referenceUrl] = await Promise.all([
        uploadFile(formData.academicRecordsBase64, formData.academicRecordsName, formData.academicRecordsMimeType, 'academic'),
        uploadFile(formData.identityDocumentBase64, formData.identityDocumentName, formData.identityDocumentMimeType, 'identity'),
        uploadFile(formData.financialDocumentsBase64, formData.financialDocumentsName, formData.financialDocumentsMimeType, 'financial'),
        uploadFile(formData.referenceLetterBase64, formData.referenceLetterName, formData.referenceLetterMimeType, 'reference')
      ]);

      // 2. Save application data to Firestore
      const applicationsRef = collection(db, 'applications');
      await addDoc(applicationsRef, {
        fullName: formData.fullName,
        phone: formData.phone,
        financialNeed: formData.financialNeed,
        essay: formData.essay,
        academicRecordUrl: academicUrl,
        identityDocUrl: identityUrl,
        financialDocUrl: financialUrl,
        referenceLetterUrl: referenceUrl,
        status: 'pending',
        submittedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error submitting application to Firebase:', error);
      throw error;
    }
  }
};
