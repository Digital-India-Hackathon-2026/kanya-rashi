import React, { useState } from 'react';
import ReportModal from './ReportModal';

const MOCK_ISSUES = [
  { id: 1, status: 'red', upvotes: 84, title: "Deep Pothole Causing Accidents", category: "Roads" },
  { id: 2, status: 'yellow', upvotes: 58, title: "Contaminated Water Supply", category: "Water" },
  { id: 3, status: 'green', upvotes: 12, title: "Cleared Garbage Dump", category: "Sanitation" }
];

export default function CitizenFeed() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24 relative">
      {/* Internal Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">🏛️ CivicPulse</span>
          </div>
          <div className="hidden sm:flex items-center justify-center">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full flex items-center gap-1 shadow-sm">
              <span>📍</span> Ghatkesar Ward 4
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
              <span className="text-sm">👤</span>
            </div>
            <span className="text-sm font-medium hidden sm:block">Citizen A</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {/* Mobile Ward Badge (shows only on small screens) */}
        <div className="flex sm:hidden justify-center mb-6">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full flex items-center gap-1 shadow-sm">
            <span>📍</span> Ghatkesar Ward 4
          </span>
        </div>

        {/* Accountability Banner */}
        <div className="bg-red-50 border-l-4 border-red-500 rounded-r-2xl p-5 mb-8 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-red-800 font-bold flex items-center gap-2 text-lg">
              <span>⚠️</span> Ward 4 Political Capital Risk
            </h2>
            <p className="text-red-600/80 text-sm mt-1 font-medium">Accumulated unresolved grievances.</p>
          </div>
          <div className="text-right">
            <span className="block text-4xl font-extrabold text-red-600 tracking-tight leading-none">142</span>
            <span className="block text-xs font-bold text-red-500 uppercase mt-1">Voters Alienated</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
          <button className="pb-3 text-emerald-600 font-bold border-b-2 border-emerald-600 text-sm transition-colors">
            🔥 Most Upvoted
          </button>
          <button className="pb-3 text-slate-500 font-medium hover:text-slate-700 text-sm transition-colors border-b-2 border-transparent hover:border-slate-300">
            🕒 Recent
          </button>
          <button className="pb-3 text-slate-500 font-medium hover:text-slate-700 text-sm transition-colors border-b-2 border-transparent hover:border-slate-300">
            ✅ Resolved
          </button>
        </div>

        {/* Issue Cards */}
        <div className="space-y-4">
          {MOCK_ISSUES.map((issue) => {
            let borderClass = '';
            let ButtonComponent;

            if (issue.status === 'red') {
              borderClass = 'border-red-500';
              ButtonComponent = (
                <button className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-sm hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 active:scale-95">
                  <span className="text-xs">▲</span> UPVOTE <span className="opacity-50">|</span> {issue.upvotes}
                </button>
              );
            } else if (issue.status === 'yellow') {
              borderClass = 'border-yellow-400';
              ButtonComponent = (
                <button disabled className="w-full sm:w-auto px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200">
                  <span className="text-sm">⏳</span> IN-PROGRESS
                </button>
              );
            } else if (issue.status === 'green') {
              borderClass = 'border-emerald-500';
              ButtonComponent = (
                <button disabled className="w-full sm:w-auto px-4 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-lg cursor-not-allowed flex items-center justify-center gap-2 border border-emerald-100">
                  <span className="text-sm">✓</span> RESOLVED
                </button>
              );
            }

            return (
              <div key={issue.id} className={`bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 ${borderClass} p-5 hover:shadow-md transition-shadow`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded uppercase tracking-wider mb-2">
                      {issue.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                      {issue.title}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    {ButtonComponent}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 px-6 py-4 bg-emerald-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl hover:bg-emerald-500 hover:scale-105 transition-all active:scale-95 flex items-center gap-2 z-40 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
      >
        <span className="text-xl leading-none">➕</span> REPORT NEW ISSUE
      </button>

      <ReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
