/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ResultsSection from './components/ResultsSection';
import HowItWorks from './components/HowItWorks';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import CtaFooter from './components/CtaFooter';
import { useFragranceSearch } from './hooks/useFragranceSearch';

export default function App() {
  const { status, data, error, lastQuery, lastBudget, search } = useFragranceSearch();

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
      <Navbar />
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
