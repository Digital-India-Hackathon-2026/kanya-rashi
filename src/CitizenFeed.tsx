import { useState, useEffect } from 'react';
import ReportModal from './ReportModal';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { LogOut, CheckCircle, Clock, AlertCircle, TrendingUp, Sparkles } from 'lucide-react';

interface Vote {
  user_id: string;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string; // 'red' | 'yellow' | 'green'
  photo_url?: string;
  resolution_photo_url?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  votes: Vote[]; // Array of votes
  upvotes_count?: number; // local fallback helper
}

interface CitizenFeedProps {
  userRole: 'citizen' | 'official';
  activeWardId: string;
  userName: string;
  citizenId: string;
  onLogout: () => void;
}

// Initial client-side mock data fallback
const INITIAL_MOCK_ISSUES: Issue[] = [
  { 
    id: 'mock-1', 
    title: "Deep Pothole Causing Accidents", 
    description: "Located near the main intersection. Multiple two-wheelers have slipped here at night.",
    category: "road", 
    status: 'red', 
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(), 
    votes: [{ user_id: 'other-user-1' }, { user_id: 'other-user-2' }],
    upvotes_count: 84
  },
  { 
    id: 'mock-2', 
    title: "Contaminated Water Supply", 
    description: "Water has a yellowish tint and foul smell for the past 3 days.",
    category: "water", 
    status: 'yellow', 
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(), 
    votes: [],
    upvotes_count: 58
  },
  { 
    id: 'mock-3', 
    title: "Cleared Garbage Dump", 
    description: "Thank you for clearing the garbage heap behind the market area!",
    category: "sanitation", 
    status: 'green', 
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(), 
    votes: [],
    upvotes_count: 12
  }
];

export default function CitizenFeed({ 
  userRole, 
  activeWardId, 
  userName, 
  citizenId,
  onLogout 
}: CitizenFeedProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filter, setFilter] = useState<'all' | 'red' | 'yellow' | 'green'>('all');
  const [sortBy, setSortBy] = useState<'upvotes' | 'recent'>('upvotes');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wardInfo, setWardInfo] = useState({ name: 'Ghatkesar Ward 4', corporator: 'Corporator Ramesh' });

  // Load ward information
  useEffect(() => {
    async function loadWardDetails() {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('wards')
          .select('*')
          .eq('id', activeWardId)
          .single();
        if (data && !error) {
          setWardInfo({ name: data.name, corporator: data.corporator_name });
          return;
        }
      }
      
      // Fallback
      if (activeWardId === 'ghatkesar-4') {
        setWardInfo({ name: 'Ghatkesar Ward 4', corporator: 'Corporator Ramesh' });
      } else {
        setWardInfo({ name: 'Pocharam Ward 1', corporator: 'Corporator Sitha' });
      }
    }
    loadWardDetails();
  }, [activeWardId]);

  // Fetch issues
  const fetchIssues = async () => {
    if (isSupabaseConfigured && supabase) {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('issues')
          .select(`
            *,
            votes (
              user_id
            )
          `)
          .eq('ward_id', activeWardId);
          
        if (data && !error) {
          setIssues(data as Issue[]);
        }
      } catch (err) {
        console.error('Error fetching issues:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Load mock from localStorage or fallback
      const stored = localStorage.getItem(`civicpulse_issues_${activeWardId}`);
      if (stored) {
        setIssues(JSON.parse(stored));
      } else {
        setIssues(INITIAL_MOCK_ISSUES);
        localStorage.setItem(`civicpulse_issues_${activeWardId}`, JSON.stringify(INITIAL_MOCK_ISSUES));
      }
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [activeWardId]);

  // Subscribe to real-time changes
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;

    const issuesSub = client
      .channel(`issues_channel_${activeWardId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'issues', filter: `ward_id=eq.${activeWardId}` },
        () => {
          fetchIssues();
        }
      )
      .subscribe();

    const votesSub = client
      .channel(`votes_channel_${activeWardId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        () => {
          fetchIssues();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(issuesSub);
      client.removeChannel(votesSub);
    };
  }, [activeWardId]);

  // Save changes helper for mock fallback
  const saveMockIssues = (updatedIssues: Issue[]) => {
    setIssues(updatedIssues);
    localStorage.setItem(`civicpulse_issues_${activeWardId}`, JSON.stringify(updatedIssues));
  };

  // Upvote an issue
  const handleUpvote = async (issueId: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        // Optimistic UI update or just wait for real-time insert
        const { error } = await supabase
          .from('votes')
          .insert({ issue_id: issueId, user_id: citizenId });
        
        if (error) {
          if (error.code === '23505') {
            alert('You have already upvoted this issue!');
          } else {
            console.error('Upvote error:', error);
          }
        } else {
          fetchIssues();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Mock Upvote
      const updated = issues.map(issue => {
        if (issue.id === issueId) {
          const alreadyVoted = issue.votes.some(v => v.user_id === citizenId);
          if (alreadyVoted) {
            alert('You have already upvoted this issue!');
            return issue;
          }
          return {
            ...issue,
            votes: [...issue.votes, { user_id: citizenId }],
            upvotes_count: (issue.upvotes_count || 0) + 1
          };
        }
        return issue;
      });
      saveMockIssues(updated);
    }
  };

  // Acknowledge an issue (Official)
  const handleAcknowledge = async (issueId: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('issues')
        .update({ status: 'yellow', updated_at: new Date().toISOString() })
        .eq('id', issueId);
      if (error) {
        console.error(error);
      } else {
        fetchIssues();
      }
    } else {
      const updated = issues.map(issue => {
        if (issue.id === issueId) {
          return { ...issue, status: 'yellow' };
        }
        return issue;
      });
      saveMockIssues(updated);
    }
  };

  // Resolve an issue (Official)
  const handleResolve = async (issueId: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('issues')
        .update({ status: 'green', updated_at: new Date().toISOString() })
        .eq('id', issueId);
      if (error) {
        console.error(error);
      } else {
        fetchIssues();
      }
    } else {
      const updated = issues.map(issue => {
        if (issue.id === issueId) {
          return { ...issue, status: 'green' };
        }
        return issue;
      });
      saveMockIssues(updated);
    }
  };

  // Issue Created callback from ReportModal
  const handleIssueReported = async (newIssue: { title: string; category: string; description: string; latitude?: number; longitude?: number }) => {
    if (isSupabaseConfigured && supabase) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(citizenId);
      const { error } = await supabase
        .from('issues')
        .insert({
          ward_id: activeWardId,
          title: newIssue.title,
          description: newIssue.description,
          category: newIssue.category,
          status: 'red',
          latitude: newIssue.latitude || 17.4483, // default SNIST coords
          longitude: newIssue.longitude || 78.6882,
          reporter_id: isUuid ? citizenId : null
        });
      if (error) {
        alert('Failed to submit issue: ' + error.message);
      } else {
        fetchIssues();
      }
    } else {
      // Mock insert
      const item: Issue = {
        id: 'mock_' + Math.random().toString(36).substring(2, 9),
        title: newIssue.title,
        description: newIssue.description,
        category: newIssue.category,
        status: 'red',
        created_at: new Date().toISOString(),
        votes: [{ user_id: citizenId }], // reporter automatically upvotes
        upvotes_count: 1,
        latitude: newIssue.latitude,
        longitude: newIssue.longitude
      };
      const updated = [item, ...issues];
      saveMockIssues(updated);
    }
  };

  // Computations
  const getUpvoteCount = (issue: Issue) => {
    if (isSupabaseConfigured) {
      return issue.votes?.length || 0;
    }
    return (issue.upvotes_count || 0) + (issue.votes?.filter(v => v.user_id === citizenId).length || 0);
  };

  const hasUpvoted = (issue: Issue) => {
    return issue.votes?.some(v => v.user_id === citizenId);
  };

  // Political Capital Risk = sum of upvotes for all RED (unresolved) issues
  const redIssues = issues.filter(i => i.status === 'red');
  const totalAlienatedVoters = redIssues.reduce((sum, issue) => sum + getUpvoteCount(issue), 0);

  // Filtering & Sorting
  const filteredIssues = issues.filter(issue => {
    if (filter === 'all') return true;
    return issue.status === filter;
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === 'upvotes') {
      return getUpvoteCount(b) - getUpvoteCount(a);
    } else {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const getCategoryEmoji = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'road': return '🛣️';
      case 'water': return '🚰';
      case 'sanitation': return '🗑️';
      case 'electrical': return '⚡';
      default: return '📍';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24 relative">
      
      {/* Configuration Status Notice Banner */}
      {!isSupabaseConfigured && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 text-center text-xs font-bold shadow-md flex items-center justify-center gap-2 animate-pulse">
          <Sparkles className="w-4 h-4" />
          <span>Local Demo Mode Active. Configure your Supabase credentials in .env.local to persist data.</span>
        </div>
      )}

      {/* Internal Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">🏛️ CivicPulse</span>
            {userRole === 'official' && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded uppercase tracking-wider">
                Official Portal
              </span>
            )}
          </div>
          
          <div className="hidden sm:flex items-center justify-center">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full flex items-center gap-1 shadow-sm">
              📍 {wardInfo.name}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                <span className="text-sm">{userRole === 'official' ? '🏛️' : '👤'}</span>
              </div>
              <span className="text-sm font-semibold hidden sm:block text-slate-700">{userName}</span>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Mobile Ward Badge (shows only on small screens) */}
          <div className="flex sm:hidden justify-center mb-6">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full flex items-center gap-1 shadow-sm">
              📍 {wardInfo.name}
            </span>
          </div>

          {/* Accountability Banner */}
          <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-l-4 border-red-500 rounded-r-2xl p-5 mb-8 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-red-800 font-bold flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5 text-red-500" />
                {wardInfo.name} Political Capital Risk
              </h2>
              <p className="text-red-700/80 text-sm mt-1 font-medium flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Accumulated votes at risk from unresolved grievances.
              </p>
            </div>
            <div className="text-right">
              <span className="block text-4xl font-extrabold text-red-600 tracking-tight leading-none">
                {totalAlienatedVoters}
              </span>
              <span className="block text-xs font-bold text-red-500 uppercase mt-1">Voters Alienated</span>
            </div>
          </div>

          {/* Filter & Sort Controls */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Status Tabs */}
            <div className="flex gap-2 w-full sm:w-auto">
              {(['all', 'red', 'yellow', 'green'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    filter === s
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {s === 'all' && '🔥 All'}
                  {s === 'red' && '🔴 Unresolved'}
                  {s === 'yellow' && '🟡 Progress'}
                  {s === 'green' && '🟢 Resolved'}
                </button>
              ))}
            </div>

            {/* Sort Toggles */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
              <span className="text-xs font-semibold text-slate-400">Sort:</span>
              <button
                onClick={() => setSortBy('upvotes')}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  sortBy === 'upvotes' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Most Upvoted
              </button>
              <button
                onClick={() => setSortBy('recent')}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  sortBy === 'recent' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Recent
              </button>
            </div>
          </div>

          {/* Issue Cards */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
              <p className="mt-2 text-sm text-slate-500 font-medium">Fetching reports from ward database...</p>
            </div>
          ) : sortedIssues.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
              <span className="text-4xl">🎉</span>
              <h3 className="text-lg font-bold text-slate-900 mt-4">All Clear in {wardInfo.name}!</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                No issues reported matching this filter. Good governance is working or citizens haven't reported yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedIssues.map((issue) => {
                let borderClass = 'border-l-red-500';
                let badgeColor = 'bg-red-50 text-red-700 border-red-100';
                let statusLabel = '🔴 Unresolved';

                if (issue.status === 'yellow') {
                  borderClass = 'border-l-yellow-400';
                  badgeColor = 'bg-yellow-50 text-yellow-700 border-yellow-100';
                  statusLabel = '🟡 In Progress';
                } else if (issue.status === 'green') {
                  borderClass = 'border-l-emerald-500';
                  badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                  statusLabel = '🟢 Resolved';
                }

                const votesCount = getUpvoteCount(issue);
                const voted = hasUpvoted(issue);

                return (
                  <div 
                    key={issue.id} 
                    className={`bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 ${borderClass} p-5 hover:shadow-md transition-all duration-200 group`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded uppercase tracking-wider">
                            {getCategoryEmoji(issue.category)} {issue.category}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${badgeColor}`}>
                            {statusLabel}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            • {new Date(issue.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                          {issue.title}
                        </h3>
                        
                        {issue.description && (
                          <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            {issue.description}
                          </p>
                        )}

                        {issue.latitude && issue.longitude && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold bg-slate-50 py-1 px-2.5 rounded-lg w-max border border-slate-100">
                            <span>📍</span> verified GPS: {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                          </div>
                        )}
                      </div>

                      {/* Action Panel */}
                      <div className="flex-shrink-0 border-t md:border-t-0 pt-4 md:pt-0 flex md:flex-col items-end gap-3 justify-between">
                        
                        {/* Voting display for citizens */}
                        {userRole === 'citizen' ? (
                          issue.status === 'red' ? (
                            <button
                              onClick={() => handleUpvote(issue.id)}
                              className={`w-full sm:w-auto px-4.5 py-2.5 rounded-xl font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 ${
                                voted 
                                  ? 'bg-emerald-100 text-emerald-800 cursor-default shadow-none border border-emerald-200' 
                                  : 'bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-emerald-200 hover:shadow-md'
                              }`}
                            >
                              <span>▲</span> {voted ? 'VOTED' : 'UPVOTE'} <span className="opacity-40">|</span> {votesCount}
                            </button>
                          ) : (
                            <div className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1.5">
                              <span>🗳️</span> {votesCount} votes logged
                            </div>
                          )
                        ) : (
                          /* Official Action Panel */
                          <div className="flex gap-2 w-full justify-end">
                            {issue.status === 'red' && (
                              <button
                                onClick={() => handleAcknowledge(issue.id)}
                                className="px-4 py-2 bg-yellow-500 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-yellow-400 active:scale-95 flex items-center gap-1.5 transition-all"
                              >
                                <Clock className="w-3.5 h-3.5" /> ACKNOWLEDGE
                              </button>
                            )}
                            {issue.status === 'yellow' && (
                              <button
                                onClick={() => handleResolve(issue.id)}
                                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-emerald-500 active:scale-95 flex items-center gap-1.5 transition-all"
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> MARK RESOLVED
                              </button>
                            )}
                            {issue.status === 'green' && (
                              <div className="px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl font-bold text-xs flex items-center gap-1.5">
                                ✓ COMPLETED
                              </div>
                            )}
                            <div className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                              🔥 {votesCount}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Report Issue Button (Moved inside left column) */}
          <div className="mt-8 flex justify-center sm:justify-start">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-4 bg-emerald-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl hover:bg-emerald-500 hover:scale-105 transition-all active:scale-95 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
            >
              <span className="text-xl leading-none">➕</span> REPORT NEW ISSUE
            </button>
          </div>
        </div>

        {/* Local Pulse Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Section A: Ward Statistics */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                Ghatkesar Ward 4 Pulse
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </h3>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Resolution Rate</span>
                    <span className="text-2xl font-black text-emerald-600">78%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider block mb-1">Active Citizens</span>
                  <span className="text-lg font-bold text-slate-800">1,204 engaged this week</span>
                </div>
              </div>
            </div>

            {/* Section B: Trending Critical Issues */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>🔥</span> Highest Upvoted (Needs Action)
              </h3>
              
              <div className="space-y-4">
                <div className="border border-red-100 bg-red-50/30 rounded-lg p-4">
                  <h4 className="font-bold text-slate-900 leading-tight mb-2">Main Approach Road Potholes</h4>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-2">
                    <span>▲</span> 842 Upvotes
                  </div>
                  <p className="text-xs font-semibold text-red-600">Warning: Reaching critical mass for Ward 4 representative.</p>
                </div>

                <div className="border border-slate-100 rounded-lg p-4 hover:border-slate-200 transition-colors">
                  <h4 className="font-bold text-slate-900 leading-tight mb-2">Streetlights out on 3rd Cross</h4>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                    <span>▲</span> 512 Upvotes
                  </div>
                </div>
              </div>
            </div>

            {/* Section C: Top Contributors */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>🏆</span> Campus Civic Leaders
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center text-sm">
                      R
                    </div>
                    <span className="font-bold text-slate-800">Rahul K.</span>
                  </div>
                  <span className="font-black text-emerald-600 text-sm">450 pts</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm">
                      P
                    </div>
                    <span className="font-bold text-slate-800">Priya M.</span>
                  </div>
                  <span className="font-black text-emerald-600 text-sm">320 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button (FAB) for Citizens */}
      {userRole === 'citizen' && (
        <button 
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 px-6 py-4 bg-emerald-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl hover:bg-emerald-500 hover:scale-105 transition-all active:scale-95 flex items-center gap-2 z-40 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
        >
          <span className="text-xl leading-none">➕</span> REPORT NEW ISSUE
        </button>
      )}

      <ReportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onIssueReported={handleIssueReported}
      />
    </div>
  );
}
