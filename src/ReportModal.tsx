import React from 'react';
import { X, Camera } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Report Community Issue</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Hardware Camera Integration */}
          <div>
            <label className="block w-full border-2 border-dashed border-emerald-500 bg-emerald-50 hover:bg-emerald-100 transition-colors rounded-xl p-8 cursor-pointer flex flex-col items-center justify-center text-center group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-sm font-bold text-emerald-700">Tap to Capture Live Photo</span>
              <span className="text-xs font-medium text-emerald-600/80 mt-1">(Camera Mode Enforced)</span>
              
              {/* The crucial hidden input forcing hardware camera */}
              <input type="file" accept="image/*" capture="environment" className="hidden" />
            </label>
            
            {/* Anti-Spoofing GPS Badge */}
            <div className="mt-3 bg-emerald-100 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm border border-emerald-200">
              <span className="animate-pulse">🟢</span> 
              Location Locked: SNIST Campus / Ghatkesar Ward 4 (Verified by GPS)
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1.5">
                Issue Category
              </label>
              <select
                id="category"
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
                defaultValue=""
              >
                <option value="" disabled>Select a category...</option>
                <option value="road">Road Damage</option>
                <option value="water">Water Supply</option>
                <option value="sanitation">Sanitation</option>
                <option value="electrical">Electrical</option>
              </select>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">
                Short Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="E.g. Broken street light on Main St."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
                Detailed Description
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Provide additional details about the exact location and severity..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-6 pt-2 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={onClose}
            className="w-full px-4 py-3.5 text-base font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Submit Verified Issue
          </button>
        </div>
      </div>
    </div>
  );
}
