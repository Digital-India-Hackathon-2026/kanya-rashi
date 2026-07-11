import React, { useState, useEffect } from 'react';
import { ClipboardList, AlertCircle, CheckCircle, Camera, ChevronDown } from 'lucide-react';

type IssueStatus = 'Pending' | 'In Progress' | 'Resolved';

interface Issue {
  id: string | number;
  date?: string;
  category: string;
  title: string;
  location: string;
  status: IssueStatus;
  escalation_level?: number;
}

interface OfficialDashboardProps {
  currentUser?: {
    name: string;
    email: string;
    role: string;
    location?: string;
  };
}

export default function OfficialDashboard({ currentUser }: OfficialDashboardProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [resolvingIssueId, setResolvingIssueId] = useState<string | number | null>(null);
  const [evidenceFile, setEvidenceFile] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidenceFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitResolution = async () => {
    if (!resolvingIssueId || !evidenceFile) return;

    try {
      await fetch(`https://kanya-rashi.onrender.com/api/issues/${resolvingIssueId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved', resolutionEvidence: evidenceFile })
      });
      setResolvingIssueId(null);
      setEvidenceFile(null);
      fetchIssues();
    } catch (err) {
      console.error("Failed to submit resolution", err);
    }
  };

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
    const interval = setInterval(fetchIssues, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id: string | number, newStatus: IssueStatus) => {
    if (newStatus === 'Resolved') {
      setResolvingIssueId(id);
      return;
    }

    try {
      await fetch(`https://kanya-rashi.onrender.com/api/issues/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchIssues(); // Refresh dashboard
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const localIssues = currentUser?.location 
    ? issues.filter(issue => issue.location === currentUser.location)
    : issues;

  const totalReports = localIssues.length;
  const pendingCount = localIssues.filter(issue => issue.status === 'Pending').length;
  const resolvedCount = localIssues.filter(issue => issue.status === 'Resolved').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{currentUser?.location || 'Regional'} Command Center</h1>
          <p className="text-slate-500 mt-1">Manage and resolve authenticated civic grievances for {currentUser?.location || 'your region'}.</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
              <ClipboardList className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Reports</p>
              <p className="text-3xl font-bold text-slate-900">{totalReports}</p>
            </div>
          </div>

          {/* Pending Action */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg text-red-600">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Action</p>
              <p className="text-3xl font-bold text-red-600">{pendingCount}</p>
            </div>
          </div>

          {/* Resolved this Month */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Resolved</p>
              <p className="text-3xl font-bold text-green-600">{resolvedCount}</p>
            </div>
          </div>
        </div>

        {/* Issue Management Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800">Incoming Verified Issues</h2>
            <div className="relative">
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value={1}>Level 1 (Ward)</option>
                <option value={2}>Level 2 (Village)</option>
                <option value={3}>Level 3 (Mandal)</option>
                <option value={4}>Level 4 (District)</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 whitespace-nowrap">ID & Date</th>
                  <th className="px-6 py-3">Issue Details</th>
                  <th className="px-6 py-3 whitespace-nowrap">Location</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {localIssues.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center bg-white">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                          <ClipboardList className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">All Clear!</h3>
                        <p className="text-slate-500">No reports found for this jurisdiction.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  localIssues.filter(issue => filterLevel === 'all' || (issue.escalation_level || 1) === filterLevel).map((issue) => (
                    <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">REP-{issue.id}</div>
                      <div className="text-xs text-slate-400 mt-1">Today</div>
                    </td>
                    <td className="px-6 py-4 min-w-[200px]">
                      <div className="font-bold text-slate-800 flex items-center flex-wrap gap-2">
                        {issue.title}
                        {(!issue.escalation_level || issue.escalation_level === 1) && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                            Level 1: Ward
                          </span>
                        )}
                        {issue.escalation_level === 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            Level 2: Village
                          </span>
                        )}
                        {issue.escalation_level === 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                            Level 3: Mandal
                          </span>
                        )}
                        {issue.escalation_level === 4 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                            Level 4: District ⚠️
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-medium bg-slate-100 text-slate-600 inline-block px-2 py-0.5 rounded mt-1 border border-slate-200">
                        {issue.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">📍</span> {issue.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative inline-block w-40">
                        <select
                          value={issue.status}
                          onChange={(e) => handleStatusChange(issue.id, e.target.value as IssueStatus)}
                          className={`w-full appearance-none px-3 py-2 pr-8 rounded-lg border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer transition-colors
                            ${issue.status === 'Pending' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                            ${issue.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                            ${issue.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                          `}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                        <ChevronDown className={`absolute right-3 top-2.5 w-4 h-4 pointer-events-none 
                            ${issue.status === 'Pending' ? 'text-red-500' : ''}
                            ${issue.status === 'In Progress' ? 'text-yellow-600' : ''}
                            ${issue.status === 'Resolved' ? 'text-green-500' : ''}
                        `} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 font-medium rounded-lg transition-colors border border-indigo-100 shadow-sm active:scale-95">
                        <Camera className="w-4 h-4" />
                        <span className="text-xs">View Evidence</span>
                      </button>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Resolution Evidence Modal */}
      {resolvingIssueId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 relative border border-slate-200">
            <button
              onClick={() => { setResolvingIssueId(null); setEvidenceFile(null); }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Proof of Resolution</h2>
            <p className="text-sm text-slate-500 mb-6">Photographic evidence is required to mark an issue as Resolved and notify citizens.</p>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center min-h-[200px] mb-6 relative overflow-hidden bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              {evidenceFile ? (
                <img src={evidenceFile} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="w-10 h-10 text-slate-400 mb-3" />
                  <span className="text-sm font-medium text-slate-600 mb-1">Click to upload photo</span>
                  <span className="text-xs text-slate-400">JPG, PNG up to 10MB</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>

            <button
              onClick={submitResolution}
              disabled={!evidenceFile}
              className={`w-full py-3 rounded-xl font-bold transition-all shadow-md ${evidenceFile ? 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-[0.98]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            >
              Submit Resolution
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
