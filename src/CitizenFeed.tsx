import { useState, useEffect } from 'react';
import ReportModal from './ReportModal';
import { CheckCircle, Map, Flame } from 'lucide-react';
import { supabase } from './supabase';

interface Issue {
  id: number;
  title: string;
  category: string;
  location: string;
  status: string;
  upvotes: number;
  image?: string;
  resolutionEvidence?: string;
  created_at?: string;
}

interface CitizenFeedProps {
  location?: string;
}

export default function CitizenFeed({ location = "Ghatkesar Ward 4" }: CitizenFeedProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [votedIssueIds, setVotedIssueIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'most_upvoted' | 'recent' | 'resolved'>('most_upvoted');

  // Mock current user for the hackathon
  const currentUser = { email: "citizen@example.com" };

  const fetchIssues = async () => {
    try {
      const res = await fetch('https://kanya-rashi.onrender.com/api/issues');
      const data = await res.json();
      setIssues(data);
    } catch (err) {
      console.error("Failed to fetch issues", err);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleUpvote = async (id: number) => {
    try {
      const res = await fetch(`https://kanya-rashi.onrender.com/api/issues/${id}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: currentUser.email })
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 400 && errorData.error === 'You have already upvoted this issue.') {
          setVotedIssueIds(prev => [...prev, id]);
        }
        alert(errorData.error || "Failed to upvote");
        return;
      }

      setVotedIssueIds(prev => [...prev, id]);
      fetchIssues(); // Refresh UI after upvote
    } catch (err) {
      console.error("Failed to upvote", err);
    }
  };

  const handleSubmitIssue = async (data: { title: string; category: string; description: string; image: string | null }) => {
    try {
      let finalImageUrl = data.image;

      if (data.image && (data.image.startsWith('blob:') || data.image.startsWith('data:'))) {
        const resBlob = await fetch(data.image);
        const blob = await resBlob.blob();
        const fileExt = blob.type.split('/')[1] || 'jpeg';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${currentUser.email}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('issues')
          .upload(filePath, blob, { upsert: true });

        if (uploadError) {
          console.error('Supabase upload error:', uploadError);
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('issues')
          .getPublicUrl(uploadData.path);

        finalImageUrl = publicUrlData.publicUrl;
      }

      await fetch('https://kanya-rashi.onrender.com/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          category: data.category,
          description: data.description,
          image: finalImageUrl,
          location: location,
          status: "Pending",
          upvotes: 0
        })
      });
      fetchIssues(); // Refresh feed immediately
      setIsModalOpen(false); // Close modal
    } catch (err) {
      console.error("Failed to submit issue", err);
    }
  };

  const localIssues = issues.filter(issue => issue.location === location);

  const totalIssues = localIssues.length;
  const resolvedIssues = localIssues.filter(issue => issue.status === 'Resolved').length;
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

  const highestUpvotedIssue = totalIssues > 0 ? [...localIssues].sort((a, b) => b.upvotes - a.upvotes)[0] : null;

  const alienatedVoters = localIssues
    .filter(issue => issue.status !== 'Resolved')
    .reduce((sum, issue) => sum + issue.upvotes, 0);

  const displayedIssues = [...localIssues].filter(issue => {
    if (activeTab === 'resolved') return issue.status === 'Resolved';
    return true;
  }).sort((a, b) => {
    if (activeTab === 'most_upvoted') {
      return b.upvotes - a.upvotes;
    } else if (activeTab === 'recent') {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
    return 0;
  });

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 font-sans text-slate-900 pb-24 relative min-h-screen">

      {/* User contextual header */}
      <div className="bg-white border-b border-slate-200 py-3 shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="text-sm">📍</span>
            <span className="text-xs font-bold text-emerald-800">{location}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Feed */}
          <div className="lg:col-span-2">

            {/* Accountability Banner */}
            <div className="bg-red-50 border-l-4 border-red-500 rounded-r-2xl p-5 mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-red-800 font-bold flex items-center gap-2 text-lg">
                  <span>⚠️</span> {location} Political Capital Risk
                </h2>
                <p className="text-red-600/80 text-sm mt-1 font-medium">Accumulated unresolved grievances.</p>
              </div>
              <div className="text-left sm:text-right">
                <span className="block text-4xl font-extrabold text-red-600 tracking-tight leading-none">{alienatedVoters}</span>
                <span className="block text-xs font-bold text-red-500 uppercase mt-1">Voters Alienated</span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
              <button
                onClick={() => setActiveTab('most_upvoted')}
                className={`pb-3 text-sm transition-colors font-bold ${activeTab === 'most_upvoted' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 border-b-2 border-transparent hover:text-slate-700 hover:border-slate-300'}`}>
                🔥 Most Upvoted
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`pb-3 text-sm transition-colors font-bold ${activeTab === 'recent' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 border-b-2 border-transparent hover:text-slate-700 hover:border-slate-300'}`}>
                🕒 Recent
              </button>
              <button
                onClick={() => setActiveTab('resolved')}
                className={`pb-3 text-sm transition-colors font-bold ${activeTab === 'resolved' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 border-b-2 border-transparent hover:text-slate-700 hover:border-slate-300'}`}>
                ✅ Resolved
              </button>
            </div>

            {/* Issue Cards */}
            <div className="space-y-4">
              {displayedIssues.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-16 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
                    <Map className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">All clear!</h3>
                  <p className="text-slate-500 max-w-md text-base leading-relaxed">
                    No issues found in {location} for this filter. Be the first to report an issue in your area!
                  </p>
                </div>
              ) : (
                displayedIssues.map((issue) => {
                  let borderClass = '';
                  let ButtonComponent;

                  if (issue.status === 'Pending') {
                    const hasVoted = votedIssueIds.includes(issue.id);
                    borderClass = 'border-red-500';
                    ButtonComponent = (
                      <button
                        onClick={() => handleUpvote(issue.id)}
                        disabled={hasVoted}
                        className={`w-full sm:w-auto px-4 py-2 font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 active:scale-95 ${hasVoted
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            : 'bg-emerald-600 text-white hover:bg-emerald-500'
                          }`}
                      >
                        <span className="text-xs">▲</span> {hasVoted ? 'UPVOTED' : 'UPVOTE'} <span className="opacity-50">|</span> {issue.upvotes}
                      </button>
                    );
                  } else if (issue.status === 'In Progress') {
                    borderClass = 'border-yellow-400';
                    ButtonComponent = (
                      <button disabled className="w-full sm:w-auto px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200">
                        <span className="text-sm">⏳</span> IN-PROGRESS
                      </button>
                    );
                  } else if (issue.status === 'Resolved') {
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
                          {issue.description && (
                            <p className="mt-2 text-sm text-slate-600">
                              {issue.description}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          {ButtonComponent}
                        </div>
                      </div>
                      {issue.image && (
                        <div className="mt-4 rounded-xl overflow-hidden shadow-sm border border-slate-100">
                          <img
                            src={issue.image}
                            alt="Issue verification"
                            className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {issue.status === 'Resolved' && issue.resolutionEvidence && (
                        <div className="mt-4 rounded-xl overflow-hidden shadow-sm border-2 border-emerald-500 relative">
                          <div className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10 flex items-center gap-1.5 backdrop-blur-sm bg-emerald-500/90 border border-emerald-400">
                            <CheckCircle className="w-3.5 h-3.5" /> Official Resolution Proof
                          </div>
                          <img
                            src={issue.resolutionEvidence}
                            alt="Official Resolution Proof"
                            className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                    </div>
                  );
                }))}
            </div>
          </div>

          {/* Right Column: Local Pulse Sidebar */}
          <div className="lg:col-span-1 space-y-6">

            {/* Section A: Ward Statistics */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <h3 className="font-bold text-slate-900">Local Pulse</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-600">Resolution Rate</span>
                    <span className="text-sm font-bold text-emerald-600">{resolutionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${resolutionRate}%` }}></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Active Citizens</span>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    1,204 <span className="text-sm font-medium text-slate-500">engaged this week</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Section B: Trending Critical Issues */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-slate-900">Highest Upvoted</h3>
              </div>

              <div className="space-y-4">
                {!highestUpvotedIssue ? (
                  <p className="text-sm text-slate-500 italic">No issues reported yet.</p>
                ) : (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-500 opacity-5 rounded-bl-full"></div>
                    <h4 className="font-bold text-slate-900 text-sm mb-2">{highestUpvotedIssue.title}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">{highestUpvotedIssue.upvotes} Upvotes</span>
                    </div>
                    {highestUpvotedIssue.upvotes > 50 && (
                      <p className="text-xs font-semibold text-red-600/90 leading-tight">
                        Warning: Reaching critical mass for {location} representative.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-8 right-8 z-40 flex items-center justify-center group">
        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative px-6 py-4 bg-emerald-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl hover:bg-emerald-500 hover:scale-105 transition-all duration-300 active:scale-95 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
        >
          <span className="text-xl leading-none">➕</span> REPORT NEW ISSUE
        </button>
      </div>

      <ReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmitIssue} />
    </div>
  );
}
