
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FOUNDATION_NAME } from '../constants';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Testimonies', path: '/testimonies' },
    { name: 'Apply Now', path: '/apply' },
  ];

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-200 selection:text-emerald-900">
      <ScrollToTop />
      
      {/* Navigation Bar */}
      <nav className="bg-white sticky top-0 z-[100] border-b border-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-3 relative z-[110]">
              <div className="flex flex-col">
                <span className="font-bold tracking-tighter text-emerald-950 serif text-2xl md:text-3xl leading-none">DGIF</span>
                <div className="text-[7px] md:text-[9px] uppercase tracking-[0.15em] text-emerald-700 whitespace-nowrap mt-1">
                  <span className="font-bold serif italic">Deborah Gbolashire Ilori</span>
                  <span className="font-medium text-emerald-600/60 ml-1.5">Foundation</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 lg:space-x-10">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-semibold transition-all relative group py-2 ${
                    location.pathname === item.path
                      ? 'text-emerald-900'
                      : 'text-stone-400 hover:text-emerald-700'
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-emerald-600 transition-all duration-300 ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
               <Link to="/apply" className="hidden sm:block bg-emerald-800 text-white px-7 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-emerald-950 transition-all">
                 Apply Now
               </Link>
               
               {/* Mobile Hamburger/Close Button - Refined Size */}
               <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-emerald-950 focus:outline-none relative z-[110]"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
               >
                 <div className="w-5 h-4 flex flex-col justify-between overflow-hidden">
                    <span className={`block h-0.5 w-full bg-current transition-all duration-300 transform origin-center ${isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
                    <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0 translate-x-4' : ''}`}></span>
                    <span className={`block h-0.5 w-full bg-current transition-all duration-300 transform origin-center ${isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
                 </div>
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay (Backdrop) */}
      <div 
        className={`fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-[90] transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Side Drawer Menu */}
      <aside className={`fixed top-0 right-0 h-full w-[85%] max-w-[400px] bg-white z-[95] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-24 pb-8 px-8 overflow-y-auto">
          <div className="flex-grow">
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-emerald-600 mb-10 border-b border-emerald-50 pb-2">Menu</p>
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`py-4 text-xl font-bold serif transition-colors ${
                    location.pathname === item.path ? 'text-emerald-800' : 'text-stone-400 hover:text-emerald-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="mt-12 pt-8 border-t border-emerald-50">
            <div className="mb-8">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-[0.4em] block mb-3">Foundation Portal</span>
              <Link to="/apply" className="block w-full bg-emerald-900 text-white text-center py-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/10">
                Application Portal
              </Link>
            </div>
            <div className="text-stone-400 text-xs flex items-center">
              <span className="mr-2">✉</span>
              <a href="mailto:help@dgifoundation.org" className="hover:text-emerald-700">help@dgifoundation.org</a>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-emerald-950 text-emerald-100/60 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-emerald-200 to-emerald-500"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-white font-bold text-3xl mb-6 md:mb-8 serif italic">DGIF</h3>
              <p className="text-base leading-relaxed max-w-sm mb-8 text-emerald-100/80">
                Honoring the life of Pastor (Mrs) Deborah Gbolashire Ilori. Dedicated to academic excellence, faith-based mentorship, and community transformation.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-6 md:mb-8 serif underline decoration-emerald-500 underline-offset-8">Quick Links</h3>
              <ul className="text-sm space-y-4 font-medium">
                <li><Link to="/" className="hover:text-emerald-300 transition-colors">Our Vision</Link></li>
                <li><Link to="/about" className="hover:text-emerald-300 transition-colors">About DGIF</Link></li>
                <li><Link to="/testimonies" className="hover:text-emerald-300 transition-colors">Testimonies</Link></li>
                <li><Link to="/apply" className="hover:text-emerald-300 transition-colors">Apply Now</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-6 md:mb-8 serif underline decoration-emerald-500 underline-offset-8">Visit Us</h3>
              <ul className="text-sm space-y-4 font-medium">
                <li className="flex items-start"><span className="mr-3 opacity-50">📍</span> Ogbomoso, Oyo State, NG</li>
                <li className="flex items-center"><span className="mr-3 opacity-50">✉️</span> help@dgifoundation.org</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-emerald-900 mt-16 md:mt-20 pt-10 text-center">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-medium text-emerald-700 mb-2 px-4">Deborah Gbolashire Ilori Foundation</p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4">
              <p className="text-[10px] text-emerald-100/30">© {new Date().getFullYear()} DGIF. Lighting the sky, one star at a time.</p>
              <span className="hidden md:inline text-emerald-100/10">•</span>
              <Link to="/privacy" className="text-[10px] text-emerald-100/50 hover:text-emerald-400 transition-colors uppercase tracking-widest font-bold">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
