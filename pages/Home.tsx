
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BIOGRAPHY_SUMMARY, PERSON_NAME, QUOTE, FULL_BIO, FULL_BIOGRAPHY_TEXT, TESTIMONIES } from '../constants';
import { firebaseService } from '../src/services/firebaseService';
import { Comment } from '../types';

const Home: React.FC = () => {
  const [dynamicTestimonies, setDynamicTestimonies] = useState<Comment[]>([]);
  const bioParagraphs = FULL_BIOGRAPHY_TEXT.split('\n\n').filter(p => p.trim() !== '');

  useEffect(() => {
    const fetchDynamicTestimonies = async () => {
      try {
        const data = await firebaseService.fetchReflections();
        setDynamicTestimonies(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching testimonies for Home page:", error);
      }
    };
    fetchDynamicTestimonies();
  }, []);

  return (
    <div className="animate-in fade-in duration-1000">
      {/* Hero Section - Majestic Portrait Centered on right */}
      <section className="relative min-h-[85vh] lg:min-h-screen flex items-center overflow-hidden bg-white border-b border-emerald-50">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/20 -skew-x-6 transform translate-x-12 hidden lg:block"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-emerald-100/10 blur-[120px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-12 lg:py-20">
          <div className="text-left order-2 lg:order-1">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 lg:mb-10 text-emerald-950 leading-[1.1] md:leading-[1.05] serif tracking-tight">
              Shining as a <span className="text-emerald-700 italic">Star</span> in the Night.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-stone-600 mb-8 lg:mb-12 max-w-xl leading-relaxed font-light italic serif border-l-4 border-emerald-600 pl-6 lg:pl-8">
              "{QUOTE}"
            </p>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/apply" 
                className="w-full sm:w-auto px-10 lg:px-12 py-4 lg:py-5 bg-emerald-800 text-white rounded-2xl font-bold hover:bg-emerald-900 transition-all shadow-2xl hover:shadow-emerald-200/50 hover:-translate-y-1 text-center"
              >
                Apply for Scholarship
              </Link>
              <Link 
                to="/about" 
                className="w-full sm:w-auto px-10 lg:px-12 py-4 lg:py-5 bg-white text-emerald-900 border-2 border-emerald-100 rounded-2xl font-bold hover:bg-emerald-50 transition-all text-center"
              >
                Read the Legacy
              </Link>
            </div>
          </div>
          
          <div className="relative order-1 lg:order-2 flex justify-center">
            <div className="relative group w-full max-w-[320px] sm:max-w-md lg:max-w-xl">
              <div className="absolute -inset-10 bg-emerald-50/50 rounded-full blur-[100px] -z-10 group-hover:bg-emerald-100/30 transition-colors duration-1000"></div>
              
              <div className="relative aspect-[3/4] rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(6,78,59,0.15)] border-[10px] sm:border-[16px] border-white">
                <img 
                  src="https://ik.imagekit.io/ifektive/pastor_ilori.jpg?updatedAt=1768001236996" 
                  alt="Pastor (Mrs) Deborah Gbolashire Ilori" 
                  className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?auto=format&fit=crop&q=80&w=1200";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating Name Badge - Adjusted for mobile */}
              <div className="absolute -bottom-6 -left-3 sm:-bottom-8 sm:-left-4 lg:-left-8 bg-white/95 backdrop-blur-sm p-4 sm:p-7 rounded-2xl sm:rounded-3xl shadow-2xl border border-emerald-50 animate-float z-20">
                <p className="text-emerald-950 font-bold serif italic text-base sm:text-xl leading-tight">Pastor (Mrs)<br/>D. G. Ilori</p>
                <p className="text-emerald-700 text-[8px] sm:text-[10px] uppercase tracking-[0.3em] font-bold mt-2 sm:mt-3 bg-emerald-50 px-2 sm:px-3 py-1 rounded-full inline-block">1955 — 2014</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="py-20 lg:py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-16 lg:mb-24 text-center">
            <h2 className="text-emerald-700 font-bold tracking-[0.4em] uppercase mb-4 text-[10px]">A Life Well Lived</h2>
            <h3 className="text-3xl sm:text-4xl md:text-6xl font-bold text-emerald-950 serif italic leading-tight">The Journey of Faith</h3>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-stone-600 leading-relaxed space-y-8 md:space-y-12">
              {bioParagraphs.slice(0, 3).map((paragraph, index) => {
                if (index === 0) {
                  return (
                    <p key={index} className="text-xl md:text-3xl font-light italic text-emerald-950 border-l-4 md:border-l-8 border-emerald-600 pl-6 md:pl-10 mb-12 md:mb-16 leading-snug serif">
                      {paragraph}
                    </p>
                  );
                }

                return (
                  <p key={index} className="text-base md:text-lg">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
          
          <div className="mt-12 lg:mt-16 text-center">
            <Link 
              to="/about" 
              className="inline-flex items-center space-x-2 text-emerald-800 font-bold hover:text-emerald-950 transition-colors group"
            >
              <span>Read the full biography</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stories Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 lg:mb-24">
            <h2 className="text-emerald-700 font-bold tracking-[0.4em] uppercase mb-4 text-[10px]">Impact Stories</h2>
            <h3 className="text-3xl sm:text-4xl md:text-6xl font-bold text-emerald-950 serif italic leading-tight">Fruit of the <span className="text-emerald-600">Vision</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 backdrop-blur-sm">
            {(dynamicTestimonies.length > 0 ? dynamicTestimonies : (TESTIMONIES as any[]).slice(0, 3)).map((testimony: any) => {
              const isDynamic = !!testimony.text;
              return (
                <div key={testimony.id} className="group bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col h-full hover:-translate-y-3">
                  <div className="flex items-center space-x-4 md:space-x-6 mb-8">
                    {isDynamic ? (
                      <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-100 flex items-center justify-center text-emerald-800 text-2xl font-bold border-4 border-white shadow-md">
                        {testimony.name.charAt(0)}
                      </div>
                    ) : (
                      <img src={testimony.image} alt={testimony.name} className="w-16 h-16 rounded-[1.5rem] object-cover border-4 border-white shadow-md" />
                    )}
                    <div>
                      <h3 className="font-bold text-emerald-950 text-base md:text-lg serif italic">{testimony.name}</h3>
                      <p className="text-emerald-700 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                        {isDynamic ? 'Reflection' : testimony.major}
                      </p>
                    </div>
                  </div>
                  <div className="relative flex-grow pl-6 border-l-2 border-emerald-100 group-hover:border-emerald-300 transition-colors">
                    <p className="text-stone-600 leading-relaxed italic text-sm md:text-base">
                      "{isDynamic ? testimony.text : testimony.content}"
                    </p>
                    <div className="mt-8 flex items-center justify-between">
                      <span className="text-[8px] md:text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                        {isDynamic ? testimony.date : testimony.year}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-16 lg:mt-20">
            <Link 
              to="/testimonies" 
              className="inline-flex items-center space-x-3 bg-emerald-50 text-emerald-900 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-100 transition-colors group shadow-sm"
            >
              <span>View More Reflections</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
