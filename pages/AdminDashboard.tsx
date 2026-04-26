import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../src/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Application } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  FileText, 
  Download, 
  ExternalLink, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ChevronRight,
  Search
} from 'lucide-react';

const ADMIN_EMAIL = 'taiwojoshua423@gmail.com';

const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== ADMIN_EMAIL) {
        navigate('/admin/login');
      } else {
        fetchApplications();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      const q = query(collection(db, 'applications'), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const apps = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Application[];
      setApplications(apps);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  const updateAppStatus = async (appId: string, newStatus: Application['status']) => {
    try {
      await updateDoc(doc(db, 'applications', appId), { status: newStatus });
      setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));
      if (selectedApp?.id === appId) {
        setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Error updating status");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const filteredApps = applications.filter(app => 
    app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.phone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-900 mb-4"></div>
          <p className="text-stone-400 font-mono text-xs uppercase tracking-widest">Accessing Board Files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#141414] font-sans selection:bg-emerald-100">
      {/* Admin Sidebar/Nav */}
      <nav className="fixed top-0 left-0 bottom-0 w-20 bg-white border-r border-stone-200 flex flex-col items-center py-8 z-50">
        <div className="mb-12">
          <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center text-white font-bold serif text-xl shadow-lg">L</div>
        </div>
        <div className="space-y-8 flex-grow">
           <button className="p-3 text-emerald-900 bg-emerald-50 rounded-xl transition-all shadow-sm">
             <Users size={20} />
           </button>
           <button onClick={() => alert("Settings coming soon")} className="p-3 text-stone-400 hover:text-emerald-900 transition-all">
             <FileText size={20} />
           </button>
        </div>
        <button onClick={handleLogout} className="p-3 text-red-400 hover:text-red-600 transition-all">
          <LogOut size={20} />
        </button>
      </nav>

      <main className="pl-20 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-stone-200 px-12 py-8 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md bg-white/80">
          <div>
            <h1 className="text-2xl font-bold serif italic tracking-tight">Scholarship Board <span className="text-emerald-600">/ Applications</span></h1>
            <p className="font-mono text-[10px] text-stone-400 uppercase tracking-[0.3em] mt-1">Reviewing the next generation of Ogbomoso stars</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                className="bg-stone-50 border border-stone-200 rounded-full pl-12 pr-6 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="p-12 max-w-7xl">
          <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[80px_1.5fr_1fr_1.5fr_1fr_60px] px-8 py-4 border-b border-stone-100 bg-stone-50/50">
              <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 font-bold">Index</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 font-bold">Candidate Name</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 font-bold">Phone</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 font-bold">Submission Date</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 font-bold">Status</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 font-bold"></span>
            </div>

            {/* Application List */}
            <div className="divide-y divide-stone-100">
              {filteredApps.length > 0 ? filteredApps.map((app, idx) => (
                <div 
                  key={app.id} 
                  onClick={() => setSelectedApp(app)}
                  className="grid grid-cols-[80px_1.5fr_1fr_1.5fr_1fr_60px] px-8 py-5 items-center hover:bg-emerald-50/50 cursor-pointer transition-colors group"
                >
                  <span className="font-mono text-[10px] text-stone-400 font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-emerald-950 text-sm">{app.fullName}</span>
                    <span className="text-[10px] text-stone-400 mt-0.5 truncate max-w-[200px]">{app.essay.substring(0, 30)}...</span>
                  </div>
                  <span className="text-xs text-stone-600 font-medium">{app.phone}</span>
                  <span className="text-xs text-stone-500 font-mono">
                    {app.submittedAt?.toDate().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      app.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-stone-100 text-stone-600'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-stone-300 group-hover:text-emerald-900 group-hover:translate-x-1 transition-all" />
                </div>
              )) : (
                <div className="py-24 text-center">
                  <p className="text-stone-400 italic serif text-lg">No matching applications found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedApp && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="fixed inset-0 bg-emerald-950/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white shadow-[-40px_0_80px_rgba(0,0,0,0.1)] z-[70] overflow-y-auto"
            >
              <div className="p-12">
                <div className="flex justify-between items-start mb-12">
                  <button onClick={() => setSelectedApp(null)} className="text-stone-400 hover:text-emerald-950 flex items-center text-[10px] font-bold uppercase tracking-widest gap-2">
                    <ChevronRight className="rotate-180" size={16} /> Back to list
                  </button>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => updateAppStatus(selectedApp.id, 'accepted')}
                      className={`px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${selectedApp.status === 'accepted' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'}`}
                    >
                      <CheckCircle2 size={14} /> Accept
                    </button>
                    <button 
                      onClick={() => updateAppStatus(selectedApp.id, 'rejected')}
                      className={`px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${selectedApp.status === 'rejected' ? 'bg-red-600 text-white shadow-lg' : 'bg-red-50 text-red-800 hover:bg-red-100'}`}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>

                <div className="mb-12">
                   <h2 className="text-4xl font-bold text-emerald-950 serif italic mb-2 tracking-tight">{selectedApp.fullName}</h2>
                   <div className="flex items-center space-x-4 text-stone-400 font-mono text-[10px] uppercase tracking-[0.2em]">
                     <span className="flex items-center gap-1.5"><Clock size={12} /> {selectedApp.submittedAt?.toDate().toLocaleDateString()}</span>
                     <span>•</span>
                     <span>{selectedApp.phone}</span>
                   </div>
                </div>

                <div className="space-y-12">
                   <section>
                     <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-800 mb-6 font-bold pb-2 border-b border-emerald-50">Financial Need</h3>
                     <p className="text-stone-600 leading-loose text-sm italic">{selectedApp.financialNeed}</p>
                   </section>

                   <section>
                      <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-800 mb-6 font-bold pb-2 border-b border-emerald-50">Scholarship Essay</h3>
                      <div className="bg-emerald-50/30 p-8 rounded-[2rem] border border-emerald-100/50">
                        <p className="text-emerald-950 leading-loose text-sm whitespace-pre-wrap">{selectedApp.essay}</p>
                      </div>
                   </section>

                   <section>
                      <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-800 mb-6 font-bold pb-2 border-b border-emerald-50">Uploaded Documents</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { label: 'Academic Records', url: selectedApp.academicRecordUrl },
                          { label: 'Identity Proof', url: selectedApp.identityDocUrl },
                          { label: 'Financial Evidence', url: selectedApp.financialDocUrl },
                          { label: 'Reference Letter', url: selectedApp.referenceLetterUrl }
                        ].map((file, i) => (
                          <a 
                            key={i}
                            href={file.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-white border border-stone-200 p-5 rounded-2xl flex items-center justify-between hover:border-emerald-500 hover:shadow-lg transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                <Download size={18} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-xs text-stone-900">{file.label}</span>
                                <span className="text-[10px] text-stone-400 mt-0.5">Click to view</span>
                              </div>
                            </div>
                            <ExternalLink size={14} className="text-stone-300 group-hover:text-emerald-600" />
                          </a>
                        ))}
                      </div>
                   </section>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
