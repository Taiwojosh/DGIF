
import React, { useState, useEffect } from 'react';
import { Comment } from '../types';
import { firebaseService } from '../src/services/firebaseService';

const Testimonies: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ name: '', role: 'Friend', text: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const data = await firebaseService.fetchReflections();
      setComments(data);
    } catch (error: any) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.text.trim()) return;
    setIsSubmitting(true);
    const tempName = newComment.name;
    const tempRole = newComment.role;
    const tempText = newComment.text;
    try {
      setNewComment({ name: '', role: 'Friend', text: '' });
      await firebaseService.addReflection(tempName, tempRole, tempText);
      
      // Optimistic update - although Firebase will refresh it soon, this feels faster
      const newlyAdded: Comment = {
        id: Date.now().toString(),
        name: tempName,
        role: tempRole,
        text: tempText,
        date: 'Just now'
      };
      setComments([newlyAdded, ...comments]);
      
      // Real refresh
      await fetchComments();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      setNewComment({ name: tempName, role: tempRole, text: tempText });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-emerald-700 font-bold tracking-[0.4em] uppercase mb-4 text-[10px]">Community Hub</h2>
          <h1 className="text-4xl md:text-7xl font-bold text-emerald-950 mb-8 serif italic">Reflections & <span className="text-emerald-600">Memories</span></h1>
          <div className="w-20 h-1 bg-emerald-200 mx-auto rounded-full mb-8"></div>
          <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto font-light leading-relaxed">
            A space for students, alumni, and friends to share how Pastor Ilori's legacy has touched their lives.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] sticky top-28 border border-emerald-100/50">
                <h3 className="text-2xl font-bold text-emerald-950 serif italic mb-6">Leave a word...</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-[0.4em] block pl-1 mb-2">Your Name</label>
                    <input type="text" value={newComment.name} onChange={(e) => setNewComment({...newComment, name: e.target.value})} className="w-full bg-white border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none transition text-emerald-950 text-sm font-medium shadow-sm" placeholder="e.g. Samuel Adeyinka" required disabled={isSubmitting} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-[0.4em] block pl-1 mb-2">Relationship</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Student', 'Alumni', 'Friend'].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setNewComment({...newComment, role})}
                          className={`py-3 rounded-xl text-xs font-bold transition ${newComment.role === role ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-emerald-800/60 hover:bg-emerald-50'}`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-[0.4em] block pl-1 mb-2">Your Reflection</label>
                    <textarea value={newComment.text} onChange={(e) => setNewComment({...newComment, text: e.target.value})} className="w-full bg-white border-none rounded-2xl px-5 py-4 h-32 focus:ring-2 focus:ring-emerald-500 outline-none transition resize-none text-emerald-950 text-sm font-medium shadow-sm" placeholder="Share a memory or word of encouragement..." required disabled={isSubmitting}></textarea>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-lg transition transform hover:-translate-y-0.5 disabled:opacity-70">
                    {isSubmitting ? 'Posting...' : 'Post Reflection'}
                  </button>
                </form>
              </div>
            </div>
            
            <div className="lg:col-span-7 space-y-6">
              {isLoading && comments.length === 0 ? (
                <div className="text-center py-12 text-stone-400 italic animate-pulse">Syncing reflections...</div>
              ) : comments.length === 0 ? (
                <div className="bg-stone-50/50 p-12 rounded-[2.5rem] border border-stone-100 text-center border-dashed">
                  <p className="text-stone-400 italic text-lg">Be the first to share a reflection.</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-shadow animate-in slide-in-from-right-4">
                    <div className="flex justify-between items-baseline mb-3">
                      <div>
                        <h4 className="font-bold text-emerald-950 text-lg serif italic leading-tight">{comment.name}</h4>
                        <span className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">{comment.role}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${comment.date === 'Just now' ? 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full' : 'text-stone-400'}`}>
                        {comment.date}
                      </span>
                    </div>
                    <p className="text-stone-600 leading-relaxed text-sm md:text-base">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonies;
