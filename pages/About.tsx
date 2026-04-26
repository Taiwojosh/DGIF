
import React, { useState, useEffect } from 'react';
import { TESTIMONIES, FULL_BIOGRAPHY_TEXT } from '../constants';
import { firebaseService } from '../src/services/firebaseService';
import { Comment } from '../types';

const About: React.FC = () => {
  const [dynamicTestimonies, setDynamicTestimonies] = useState<Comment[]>([]);
  const bioParagraphs = FULL_BIOGRAPHY_TEXT.split('\n\n').filter(p => p.trim() !== '');

  useEffect(() => {
    const fetchDynamicTestimonies = async () => {
      try {
        const data = await firebaseService.fetchReflections();
        // Only take the top 3 or latest ones
        setDynamicTestimonies(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching testimonies for About page:", error);
      }
    };
    fetchDynamicTestimonies();
  }, []);

  return (
    <div className="animate-in fade-in duration-1000 bg-white min-h-screen">
      {/* Hero Header - Refined with better mobile clearance */}
      <section className="bg-emerald-950 pt-32 pb-24 md:pt-48 md:pb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900/10 blur-[150px]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-emerald-400 font-bold tracking-[0.4em] uppercase mb-6 text-[10px] md:text-xs">Our Journey</h2>
          <h1 className="text-4xl md:text-8xl font-bold text-white serif mb-8 italic tracking-tighter">The Vision & The Legacy</h1>
          <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-emerald-500 to-emerald-200 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Main Biography Content */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg prose-emerald mx-auto text-stone-600 leading-relaxed space-y-10">
            {bioParagraphs.map((paragraph, index) => {
              const isHeading = paragraph.trim().split('\n').length === 1 && 
                               (paragraph.includes('Background') || 
                                paragraph.includes('Service') || 
                                paragraph.includes('Ministry') || 
                                paragraph.includes('Family') || 
                                paragraph.includes('Vision') || 
                                paragraph.includes('Legacy') || 
                                paragraph.includes('Impact') ||
                                paragraph.includes('BIOGRAPHY OF'));
              
              if (index === 0) {
                return (
                  <p key={index} className="text-xl md:text-3xl font-light italic text-emerald-950 border-l-4 md:border-l-8 border-emerald-600 pl-6 md:pl-10 mb-12 md:mb-16 leading-snug serif">
                    {paragraph}
                  </p>
                );
              }

              if (isHeading) {
                return (
                  <h4 key={index} className="text-2xl md:text-3xl font-bold text-emerald-950 serif mt-16 mb-8 italic border-b border-emerald-100 pb-4">
                    {paragraph}
                  </h4>
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
      </section>

      {/* Impact Stories - Moved from Testimonies as per user request */}
      <section className="py-20 md:py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-emerald-700 font-bold tracking-[0.4em] uppercase mb-4 text-[10px]">Impact Stories</h2>
            <h3 className="text-3xl md:text-6xl font-bold text-emerald-950 mb-8 serif italic">Fruit of the <span className="text-emerald-600">Vision</span></h3>
            <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto font-light leading-relaxed">
              The seeds planted at Dayspring Model School continue to grow into towering trees of excellence across the globe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {dynamicTestimonies.length > 0 ? (
              dynamicTestimonies.map((testimony) => (
                <div key={testimony.id} className="group bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-1000 flex flex-col h-full hover:-translate-y-3">
                  <div className="flex items-center space-x-4 md:space-x-6 mb-8 md:mb-10">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] bg-emerald-100 flex items-center justify-center text-emerald-800 text-2xl font-bold border-4 border-white shadow-md">
                      {testimony.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-950 text-base md:text-lg serif italic">{testimony.name}</h3>
                      <p className="text-emerald-700 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Reflection</p>
                    </div>
                  </div>
                  <div className="relative flex-grow pl-6 md:pl-8 border-l-2 border-emerald-100 group-hover:border-emerald-300 transition-colors duration-700">
                    <p className="text-stone-600 leading-[1.8] italic text-sm md:text-base">"{testimony.text}"</p>
                    <div className="mt-6 md:mt-8 flex items-center justify-between">
                      <span className="text-[8px] md:text-[10px] text-stone-400 font-bold uppercase tracking-widest">{testimony.date}</span>
                      <span className="text-xl text-emerald-200/50 group-hover:text-emerald-400/50 transition-colors">❞</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              TESTIMONIES.map((testimony) => (
                <div key={testimony.id} className="group bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-1000 flex flex-col h-full hover:-translate-y-3">
                  <div className="flex items-center space-x-4 md:space-x-6 mb-8 md:mb-10">
                    <img src={testimony.image} alt={testimony.name} className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] object-cover border-4 border-white shadow-md" />
                    <div>
                      <h3 className="font-bold text-emerald-950 text-base md:text-lg serif italic">{testimony.name}</h3>
                      <p className="text-emerald-700 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{testimony.major}</p>
                    </div>
                  </div>
                  <div className="relative flex-grow pl-6 md:pl-8 border-l-2 border-emerald-100 group-hover:border-emerald-300 transition-colors duration-700">
                    <p className="text-stone-600 leading-[1.8] italic text-sm md:text-base">"{testimony.content}"</p>
                    <div className="mt-6 md:mt-8 flex items-center justify-between">
                      <span className="text-[8px] md:text-[10px] text-stone-400 font-bold uppercase tracking-widest">{testimony.year}</span>
                      <span className="text-xl text-emerald-200/50 group-hover:text-emerald-400/50 transition-colors">❞</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-20">
            <p className="text-stone-400 font-medium italic mb-10 max-w-lg mx-auto">
              In celebrating a decade of her transition to glory, we choose not only to remember her but to carry her vision forward.
            </p>
            <div className="flex justify-center items-center space-x-6">
              <span className="h-[1px] w-12 md:w-16 bg-emerald-100"></span>
              <span className="text-emerald-800 font-bold serif italic text-lg md:text-xl">The Light Continues</span>
              <span className="h-[1px] w-12 md:w-16 bg-emerald-100"></span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
