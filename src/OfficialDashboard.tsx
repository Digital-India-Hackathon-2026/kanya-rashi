import { useState } from 'react';
import { Shield, AlertTriangle, Clock, CheckCircle, TrendingDown, MapPin } from 'lucide-react';

interface Issue {
  id: number;
  status: 'red' | 'yellow' | 'green';
  upvotes: number;
  title: string;
  category: string;
}

const INITIAL_ISSUES: Issue[] = [
  { id: 1, status: 'red', upvotes: 84, title: "Deep Pothole Causing Accidents", category: "Roads" },
  { id: 2, status: 'yellow', upvotes: 58, title: "Contaminated Water Supply", category: "Water" },
  { id: 3, status: 'green', upvotes: 12, title: "Cleared Garbage Dump", category: "Sanitation" },
  { id: 4, status: 'red', upvotes: 45, title: "Broken Streetlights on Main Road", category: "Infrastructure" },
  { id: 5, status: 'red', upvotes: 38, title: "Open Sewage Drain Near School", category: "Sanitation" },
];

export default function OfficialDashboard() {
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  const [filter, setFilter] = useState<'all' | 'red' | 'yellow' | 'green'>('all');

  const updateStatus = (id: number, nextStatus: 'yellow' | 'green') => {
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === id ? { ...issue, status: nextStatus } : issue
      )
    );
  };

  const filteredIssues = issues.filter(issue => filter === 'all' || issue.status === filter);

  // Statistics calculations
  const redCount = issues.filter(i => i.status === 'red').length;
  const yellowCount = issues.filter(i => i.status === 'yellow').length;
  const greenCount = issues.filter(i => i.status === 'green').length;
  
  // Total voters alienated is calculated as the sum of upvotes for all unresolved (red + yellow) issues
  const votersAlienated = issues
    .filter(i => i.status !== 'green')
    .reduce((sum, i) => sum + i.upvotes, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      {/* Dashboard Top Header Banner */}
      <div className="bg-indigo-900 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-indigo-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Official Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">Ward 4 Administration</h1>
            <p className="text-indigo-200 text-sm mt-1">Welcome back, Corporator Ramesh</p>
          </div>
          <div className="flex items-center gap-2 bg-indigo-850 px-4 py-2 rounded-xl border border-indigo-700/50 self-start sm:self-auto">
            <MapPin className="h-4 w-4 text-indigo-300" />
            <span className="text-sm font-semibold">Ghatkesar Ward 4, Hyd</span>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Critical Risk */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between text-rose-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Voters at Risk</span>
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-rose-600 block leading-none">{votersAlienated}</span>
              <span className="text-[11px] font-medium text-slate-500 mt-1 block">Active unsatisfied voters</span>
            </div>
          </div>

          {/* Card 2: Unresolved (Red) */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between text-red-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Unresolved</span>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-red-600 block leading-none">{redCount}</span>
              <span className="text-[11px] font-medium text-slate-500 mt-1 block">Needs immediate attention</span>
            </div>
          </div>

          {/* Card 3: In Progress (Yellow) */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">In Progress</span>
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-amber-600 block leading-none">{yellowCount}</span>
              <span className="text-[11px] font-medium text-slate-500 mt-1 block">Work in execution</span>
            </div>
          </div>

          {/* Card 4: Resolved (Green) */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Resolved</span>
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-emerald-600 block leading-none">{greenCount}</span>
              <span className="text-[11px] font-medium text-slate-500 mt-1 block">Completed & verified</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between border-b border-slate-200 mb-6 pb-2">
          <div className="flex gap-4">
            <button 
              onClick={() => setFilter('all')}
              className={`pb-2 text-sm font-bold border-b-2 transition-colors ${
                filter === 'all' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              All Grievances
            </button>
            <button 
              onClick={() => setFilter('red')}
              className={`pb-2 text-sm font-bold border-b-2 transition-colors ${
                filter === 'red' ? 'border-red-500 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              🔴 Unresolved ({redCount})
            </button>
            <button 
              onClick={() => setFilter('yellow')}
              className={`pb-2 text-sm font-bold border-b-2 transition-colors ${
                filter === 'yellow' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              🟡 In Progress ({yellowCount})
            </button>
            <button 
              onClick={() => setFilter('green')}
              className={`pb-2 text-sm font-bold border-b-2 transition-colors ${
                filter === 'green' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              🟢 Resolved ({greenCount})
            </button>
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm">
              <span className="text-4xl block mb-2">🎉</span>
              <h3 className="font-bold text-slate-700">No issues found in this category</h3>
              <p className="text-slate-400 text-sm mt-1">Keep up the good governance!</p>
            </div>
          ) : (
            filteredIssues.map((issue) => {
              let borderClass = '';
              let statusLabel = '';
              let statusBg = '';

              if (issue.status === 'red') {
                borderClass = 'border-red-500';
                statusLabel = 'Critical Risk';
                statusBg = 'bg-red-50 text-red-700 border-red-100';
              } else if (issue.status === 'yellow') {
                borderClass = 'border-amber-400';
                statusLabel = 'In Progress';
                statusBg = 'bg-amber-50 text-amber-700 border-amber-100';
              } else if (issue.status === 'green') {
                borderClass = 'border-emerald-500';
                statusLabel = 'Resolved';
                statusBg = 'bg-emerald-50 text-emerald-700 border-emerald-100';
              }

              return (
                <div key={issue.id} className={`bg-white rounded-2xl shadow-sm border border-slate-100 border-l-4 ${borderClass} p-5 hover:shadow-md transition-shadow`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md uppercase tracking-wider">
                          {issue.category}
                        </span>
                        <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md border ${statusBg}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">
                        {issue.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-slate-400 text-xs">
                        <span>🔥 {issue.upvotes} Citizens upvoted</span>
                        <span>•</span>
                        <span>Ward 4</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {issue.status === 'red' && (
                        <>
                          <button 
                            onClick={() => updateStatus(issue.id, 'yellow')}
                            className="px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-amber-450 active:scale-95 transition-all flex items-center gap-1.5"
                          >
                            <Clock className="w-4 h-4" /> Acknowledge
                          </button>
                          <button 
                            onClick={() => updateStatus(issue.id, 'green')}
                            className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-emerald-550 active:scale-95 transition-all flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-4 h-4" /> Resolve
                          </button>
                        </>
                      )}
                      {issue.status === 'yellow' && (
                        <button 
                          onClick={() => updateStatus(issue.id, 'green')}
                          className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-emerald-550 active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" /> Mark Resolved
                        </button>
                      )}
                      {issue.status === 'green' && (
                        <span className="text-emerald-600 font-bold text-sm flex items-center gap-1">
                          <CheckCircle className="w-5 h-5" /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
