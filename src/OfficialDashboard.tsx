import { useState } from 'react';
import { ClipboardList, AlertCircle, CheckCircle, Camera, ChevronDown } from 'lucide-react';

type IssueStatus = 'Pending' | 'In Progress' | 'Resolved';

interface Issue {
  id: string;
  date: string;
  category: string;
  title: string;
  location: string;
  status: IssueStatus;
}

const INITIAL_ISSUES: Issue[] = [
  { id: 'REP-001', date: '2026-07-10', category: 'Electrical', title: 'Broken street light near C-Block', location: 'SNIST Campus', status: 'Pending' },
  { id: 'REP-002', date: '2026-07-09', category: 'Water', title: 'Water leak in main pipeline', location: 'Ghatkesar Ward 4', status: 'In Progress' },
  { id: 'REP-003', date: '2026-07-08', category: 'Roads', title: 'Pothole on main approach road', location: 'SNIST Campus', status: 'Resolved' },
];

export default function OfficialDashboard() {
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);

  const updateIssueStatus = (id: string, newStatus: IssueStatus) => {
    setIssues(issues.map(issue => 
      issue.id === id ? { ...issue, status: newStatus } : issue
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Admin Navbar */}
      <nav className="sticky top-0 z-50 bg-indigo-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">🏛️ CivicPulse</span>
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-indigo-800 text-xs font-semibold uppercase tracking-wider text-indigo-200 hidden sm:inline-block">
              Official Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden sm:inline-block">Corporator Ramesh</span>
            <div className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center border border-indigo-500">
              <span className="text-sm">🏛️</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Ward 4 Command Center</h1>
          <p className="text-slate-500 mt-1">Manage and resolve authenticated civic grievances.</p>
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
              <p className="text-3xl font-bold text-slate-900">124</p>
            </div>
          </div>
          
          {/* Pending Action */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg text-red-600">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Action</p>
              <p className="text-3xl font-bold text-red-600">18</p>
            </div>
          </div>

          {/* Resolved this Month */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Resolved this Month</p>
              <p className="text-3xl font-bold text-green-600">106</p>
            </div>
          </div>
        </div>

        {/* Issue Management Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">Incoming Verified Issues</h2>
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
                {issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{issue.id}</div>
                      <div className="text-xs text-slate-400 mt-1">{issue.date}</div>
                    </td>
                    <td className="px-6 py-4 min-w-[200px]">
                      <div className="font-bold text-slate-800">{issue.title}</div>
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
                          onChange={(e) => updateIssueStatus(issue.id, e.target.value as IssueStatus)}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
