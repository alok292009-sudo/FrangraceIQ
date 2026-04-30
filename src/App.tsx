/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ResultsSection from './components/ResultsSection';
import HowItWorks from './components/HowItWorks';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import CtaFooter from './components/CtaFooter';
import Profile from './components/Profile';
import { useFragranceSearch } from './hooks/useFragranceSearch';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const { status, data, error, lastQuery, lastBudget, search } = useFragranceSearch();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (status !== 'idle') {
      // Use requestAnimationFrame to ensure the scroll happens after the browser has painted
      requestAnimationFrame(() => {
        const el = document.getElementById('results');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }, [status]);

  return (
    <div className="bg-black selection:bg-white selection:text-black min-h-screen">
      <Navbar onOpenProfile={() => setShowProfile(true)} />
      
      <AnimatePresence>
        {showProfile && (
          <Profile 
            onClose={() => setShowProfile(false)} 
            onSearchAgain={(q, b) => search(q, b)} 
          />
        )}
      </AnimatePresence>

      <main className="relative z-0">
        <Hero search={search} status={status} />
        <div className="bg-black relative z-10">
          <ResultsSection 
            status={status} 
            data={data} 
            error={error} 
            lastQuery={lastQuery} 
            lastBudget={lastBudget}
            search={search} 
          />
          <HowItWorks />
          <Stats />
          <Testimonials />
          <CtaFooter />
        </div>
      </main>
    </div>
  );
}
