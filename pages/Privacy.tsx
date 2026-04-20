
import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-1000 bg-white min-h-screen">
      <section className="bg-emerald-950 pt-32 pb-20 md:pt-48 md:pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-900/10 blur-[120px]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-emerald-400 font-bold tracking-[0.4em] uppercase mb-6 text-[10px]">Legal & Trust</h2>
          <h1 className="text-4xl md:text-7xl font-bold text-white serif mb-8 italic">Privacy Policy</h1>
          <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full"></div>
        </div>
      </section>

      <section className="py-16 md:py-24 max-w-4xl mx-auto px-4">
        <div className="prose prose-stone prose-lg max-w-none">
          <p className="text-xl text-stone-600 italic serif border-l-4 border-emerald-600 pl-6 mb-16">
            "Integrity is doing the right thing, even when no one is watching." At DGIF, we handle your personal journey with the same care and honor that Pastor Deborah Gbolashire Ilori showed every life she touched.
          </p>

          <div className="space-y-16 text-stone-700">
            <div>
              <h3 className="text-2xl font-bold text-emerald-950 serif italic mb-6">1. Information We Collect</h3>
              <p className="mb-4">To evaluate scholarship applications and foster a community of remembrance, we collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Identity Data:</strong> Full name, age, and location.</li>
                <li><strong>Contact Data:</strong> Email address and phone number.</li>
                <li><strong>Educational Data:</strong> Current school, grade level, and academic history.</li>
                <li><strong>Personal Narratives:</strong> Essays and background stories regarding financial or family situations.</li>
                <li><strong>Community Content:</strong> Reflections and comments shared on our public "Testimonies" page.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-emerald-950 serif italic mb-6">2. How We Use Your Data</h3>
              <p className="mb-4">Your information is used strictly for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Scholarship Evaluation:</strong> Our board reviews applications to identify students who best reflect the foundation's vision.</li>
                <li><strong>Communication:</strong> To update you on your application status or share news about foundation initiatives.</li>
                <li><strong>Community Building:</strong> Testimonials and comments are shared publicly to inspire others, only after your explicit submission.</li>
              </ul>
            </div>

            <div className="bg-stone-50 p-8 md:p-12 rounded-[2.5rem] border border-stone-100 italic">
              <h4 className="text-emerald-900 font-bold mb-4 not-italic">Data Security & Confidentiality</h4>
              <p className="text-sm md:text-base leading-relaxed">
                We utilize industry-standard encryption and secure database management (via Supabase) to protect your records. Scholarship essays containing personal hardship stories are treated with "Pastoral confidentiality"—they are never shared outside the foundation's selection board without your prior consent.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-emerald-950 serif italic mb-6">3. Your Rights</h3>
              <p>
                You have the right to request a copy of the data we hold about you, or to request the deletion of your application or community comments at any time. To exercise these rights, please reach out to our team at <a href="mailto:help@dgifoundation.org" className="text-emerald-700 font-bold underline">help@dgifoundation.org</a>.
              </p>
            </div>

            <div className="pt-12 border-t border-stone-100 text-center">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Last Updated: October 2024</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
