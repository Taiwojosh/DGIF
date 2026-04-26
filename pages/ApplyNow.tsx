
import React, { useState, useRef, useEffect } from 'react';
import { ApplicationFormData, ApplicationStatus } from '../types';
import { firebaseService } from '../src/services/firebaseService';

const DRAFT_KEY = 'dgif_scholarship_draft';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ApplyNow: React.FC = () => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    phone: '',
    financialNeed: '',
    essay: ''
  });

  const [status, setStatus] = useState<ApplicationStatus>(ApplicationStatus.IDLE);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        // Only restore text fields, files should be re-uploaded for security/freshness
        setFormData(prev => ({
          ...prev,
          fullName: parsed.fullName || '',
          phone: parsed.phone || '',
          financialNeed: parsed.financialNeed || '',
          essay: parsed.essay || ''
        }));
      } catch (e) {
        console.error("Draft recovery failed", e);
      }
    }
  }, []);

  // Save draft on changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const draftData = {
        fullName: formData.fullName,
        phone: formData.phone,
        financialNeed: formData.financialNeed,
        essay: formData.essay
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData.fullName, formData.phone, formData.financialNeed, formData.essay]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldPrefix: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert(`File "${file.name}" is too large. Maximum size is 5MB. Please compress your file and try again.`);
      if (e.target) e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = (event.target?.result as string).split(',')[1];
      setFormData(prev => ({
        ...prev,
        [`${fieldPrefix}Base64`]: base64String,
        [`${fieldPrefix}Name`]: file.name,
        [`${fieldPrefix}MimeType`]: file.type
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all files are uploaded
    if (!formData.academicRecordsBase64 || !formData.identityDocumentBase64 || !formData.financialDocumentsBase64 || !formData.referenceLetterBase64) {
      alert("Please upload all required documents before submitting.");
      return;
    }

    setStatus(ApplicationStatus.SUBMITTING);
    
    try {
      await firebaseService.submitApplication(formData);
      localStorage.removeItem(DRAFT_KEY);
      setStatus(ApplicationStatus.SUCCESS);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("There was an error submitting your application. Please try again.");
      setStatus(ApplicationStatus.IDLE);
    }
  };

  const FileUploadZone = ({ label, fieldPrefix, accept }: { label: string, fieldPrefix: string, accept: string }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileName = formData[`${fieldPrefix}Name` as keyof ApplicationFormData] as string;

    return (
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-[0.4em] block pl-1">{label} *</label>
        <div 
          className="w-full bg-emerald-50/50 border-2 border-dashed border-emerald-200 rounded-3xl px-6 py-8 text-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-400 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => handleFileChange(e, fieldPrefix)} 
            className="hidden" 
            accept={accept}
          />
          {fileName ? (
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-emerald-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className="text-emerald-950 font-medium text-sm">{fileName}</span>
              <span className="text-emerald-600 text-xs mt-1">Click to change file</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-emerald-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <span className="text-emerald-950 font-medium text-sm">Upload {label}</span>
              <span className="text-stone-400 text-xs mt-1">PDF, DOC, or Image (Max 5MB)</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (status === ApplicationStatus.SUCCESS) {
    return (
      <div className="max-w-2xl mx-auto py-24 md:py-32 px-4 text-center animate-in zoom-in-95 duration-500">
        <div className="bg-emerald-100 w-24 h-24 md:w-28 md:h-28 rounded-[2rem] flex items-center justify-center mx-auto mb-8 md:mb-10 border border-emerald-200 shadow-2xl shadow-emerald-200/50">
          <svg className="w-12 h-12 md:w-14 md:h-14 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-6 serif italic">Legacy Entrusted</h1>
        <p className="text-stone-500 mb-10 md:mb-12 text-base md:text-lg leading-relaxed max-w-lg mx-auto">
          Thank you for applying, {formData.fullName.split(' ')[0]}. We have received your submission. Our board reviews applications with the same compassion Pastor Ilori showed all her students.
        </p>
        <button 
          onClick={() => window.location.hash = '/'}
          className="w-full sm:w-auto bg-emerald-900 text-white px-10 py-4 md:px-12 md:py-5 rounded-2xl font-bold hover:bg-emerald-800 transition shadow-xl hover:-translate-y-1"
        >
          Return to Foundation Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 md:py-24 px-4 sm:px-6 bg-emerald-50/20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8 lg:space-y-10">
          <div className="bg-emerald-900 text-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_32px_64px_rgba(6,78,59,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 md:w-48 md:h-48 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 serif italic relative z-10">DGIF Mission</h3>
            <p className="text-emerald-100/70 text-sm mb-8 md:mb-10 leading-relaxed relative z-10 font-light">
              "We are like stars in the night, lighting up the sky." We seek students who show resilience, character, and academic potential.
            </p>
            <div className="space-y-5 relative z-10">
               {[
                 'Orphans & Fatherless Children',
                 'Children of Single Mothers',
                 'Residents of Ogbomoso Land',
                 'Academic Excellence & Need'
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center space-x-3 group">
                   <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-700 rounded-lg flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                     <span className="text-[8px] md:text-[10px]">✔</span>
                   </div>
                   <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-100">{item}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="lg:col-span-8">
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-emerald-950 mb-3 md:mb-4 serif">Scholarship Portal</h1>
            <p className="text-stone-500 font-medium text-base md:text-lg italic">Empowering the next generation of leaders in Ogbomoso.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12 bg-white p-6 sm:p-10 md:p-16 rounded-[2.5rem] sm:rounded-[4rem] border border-emerald-50 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-[0.4em] block pl-1">Legal Full Name *</label>
                <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className="w-full bg-emerald-50/50 border-none rounded-2xl px-6 py-4 md:py-5 focus:ring-2 focus:ring-emerald-500 outline-none transition font-medium text-emerald-950 text-sm" placeholder="e.g. Samuel Adeyinka" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-[0.4em] block pl-1">Primary Phone *</label>
                <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full bg-emerald-50/50 border-none rounded-2xl px-6 py-4 md:py-5 focus:ring-2 focus:ring-emerald-500 outline-none transition font-medium text-emerald-950 text-sm" placeholder="+234..." />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1 pr-1 gap-4">
                <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-[0.4em] block pl-1">Financial Need *</label>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${formData.financialNeed.length < 150 ? 'text-amber-600 bg-amber-50' : 'text-emerald-500 bg-emerald-50'}`}>
                  {formData.financialNeed.length} / 150 min chars
                </span>
              </div>
              <textarea 
                required 
                minLength={150}
                name="financialNeed" 
                value={formData.financialNeed} 
                onChange={handleInputChange}
                className="w-full bg-emerald-50/50 border-none rounded-3xl px-6 py-4 md:py-5 h-32 md:h-40 focus:ring-2 focus:ring-emerald-500 outline-none transition resize-none text-emerald-950 font-medium text-sm" 
                placeholder="Share your story: family situation, current education, and financial needs..."
              ></textarea>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1 pr-1 gap-4">
                <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-[0.4em] block pl-1">Essay *</label>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${formData.essay.length < 500 ? 'text-amber-600 bg-amber-50' : 'text-emerald-500 bg-emerald-50'}`}>
                  {formData.essay.length} / 500 min chars
                </span>
              </div>
              <textarea 
                required 
                minLength={500}
                name="essay" 
                value={formData.essay} 
                onChange={handleInputChange} 
                className="w-full bg-emerald-50/50 border-none rounded-3xl px-6 py-4 md:py-5 h-60 md:h-72 focus:ring-2 focus:ring-emerald-500 outline-none transition resize-none text-emerald-950 font-medium text-sm" 
                placeholder="How do you intend to use your education to light up the world around you? (Min 100 words)"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <FileUploadZone 
                label="Academic Records" 
                fieldPrefix="academicRecords" 
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
              />
              <FileUploadZone 
                label="Identity Document" 
                fieldPrefix="identityDocument" 
                accept=".pdf,.jpg,.jpeg,.png" 
              />
              <FileUploadZone 
                label="Financial Documents" 
                fieldPrefix="financialDocuments" 
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
              />
              <FileUploadZone 
                label="Reference Letter" 
                fieldPrefix="referenceLetter" 
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
              />
            </div>

            <div className="pt-4 md:pt-8 space-y-6">
              <div className="bg-stone-50 border border-stone-200 p-6 rounded-2xl">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  </div>
                  <div>
                    <p className="text-xs text-stone-600 leading-relaxed font-medium">
                      By submitting, you agree that DGIF will store your identity and financial records strictly for scholarship evaluation. Data is stored securely on protected Google Cloud infrastructure and is only accessible to authorized board members.
                    </p>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status === ApplicationStatus.SUBMITTING} 
                className="w-full py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-[0_20px_40px_rgba(6,78,59,0.2)] transition transform hover:-translate-y-1 disabled:opacity-50 active:scale-95 text-base md:text-lg"
              >
                {status === ApplicationStatus.SUBMITTING ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 md:h-6 md:w-6 mr-3 md:mr-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Uploading documents... Please wait
                  </span>
                ) : 'Submit My Application'}
              </button>
              <p className="text-center text-[10px] text-stone-400 mt-6 font-bold uppercase tracking-[0.2em]">All information is kept strictly confidential.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyNow;
