
import React, { useState, useEffect } from 'react';
import { Comment } from '../types';
import { googleSheetsService } from '../src/services/googleSheetsService';

const CACHE_KEY = 'dgif_comments_cache';

const Testimonies: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ name: '', text: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  const GOOGLE_SHEETS_URL = (import.meta as any).env.VITE_GOOGLE_SHEETS_URL;

  useEffect(() => {
    if (!GOOGLE_SHEETS_URL) {
      setSetupError('GOOGLE_SHEETS_URL_MISSING');
      setIsLoading(false);
      return;
    }

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        setComments(JSON.parse(cached));
        setIsLoading(false);
      } catch (e) {
        console.error("Cache parse error", e);
      }
    }
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const data = await googleSheetsService.fetchComments();
      setComments(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      setSetupError(null);
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      setSetupError('FETCH_ERROR');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.text.trim()) return;
    setIsSubmitting(true);
    const tempName = newComment.name;
    const tempText = newComment.text;
    try {
      setNewComment({ name: '', text: '' });
      await googleSheetsService.postComment(tempName, tempText);
      
      // Optimistic update
      const newlyAdded: Comment = {
        id: Date.now().toString(),
        name: tempName,
        text: tempText,
        date: 'Just now'
      };
      const updatedList = [newlyAdded, ...comments];
      setComments(updatedList);
      localStorage.setItem(CACHE_KEY, JSON.stringify(updatedList));
      
      // Refresh after a delay to allow Google Sheets to update
      setTimeout(fetchComments, 2000);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      setNewComment({ name: tempName, text: tempText });
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
              ) : setupError === 'GOOGLE_SHEETS_URL_MISSING' ? (
                <div className="bg-emerald-50 p-10 rounded-[3rem] text-center border border-emerald-100">
                   <p className="text-emerald-950 font-bold serif italic text-lg mb-4">Configuration Required</p>
                   <p className="text-emerald-800/70 text-sm">Please set VITE_GOOGLE_SHEETS_URL in your environment.</p>
                </div>
              ) : setupError === 'FETCH_ERROR' && comments.length === 0 ? (
                <div className="bg-red-50 p-10 rounded-[3rem] text-center border border-red-100">
                   <p className="text-red-950 font-bold serif italic text-lg mb-4">Connection Error</p>
                   <p className="text-red-800/70 text-sm">Could not connect to Google Sheets. Please check your URL and Apps Script configuration.</p>
                </div>
              ) : comments.length === 0 ? (
                <div className="bg-stone-50/50 p-12 rounded-[2.5rem] border border-stone-100 text-center border-dashed">
                  <p className="text-stone-400 italic text-lg">Be the first to share a reflection.</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-shadow animate-in slide-in-from-right-4">
                    <div className="flex justify-between items-baseline mb-3">
                      <h4 className="font-bold text-emerald-950 text-lg serif italic">{comment.name}</h4>
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
