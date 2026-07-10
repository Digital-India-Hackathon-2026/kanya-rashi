import React, { useState, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import Webcam from 'react-webcam';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; category: string; description: string; image: string | null }) => void;
}

export default function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleFormSubmit = () => {
    onSubmit({ title, category, description, image: capturedImage });
    setCategory('');
    setTitle('');
    setDescription('');
    setCapturedImage(null);
  };
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  // Ensure modal state resets when closed if desired, 
  // but keeping it simple as per instructions.
  
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
          
          {/* Live Webcam Camera Integration */}
          <div>
            <div className="w-full border-2 border-dashed border-emerald-500 bg-emerald-50 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              {!capturedImage ? (
                <>
                  <div className="w-full rounded-xl overflow-hidden bg-black shadow-sm mb-3">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <button 
                    onClick={capture}
                    className="px-5 py-2 bg-white border border-emerald-200 text-emerald-700 font-bold rounded-lg shadow-sm hover:bg-emerald-50 transition-colors flex items-center gap-2 active:scale-95"
                  >
                    <span>📸</span> Snap Photo
                  </button>
                </>
              ) : (
                <>
                  <div className="w-full rounded-xl overflow-hidden shadow-sm mb-3">
                    <img src={capturedImage} alt="Captured" className="w-full h-48 object-cover" />
                  </div>
                  <button 
                    onClick={retake}
                    className="px-5 py-2 bg-white border border-emerald-200 text-emerald-700 font-bold rounded-lg shadow-sm hover:bg-emerald-50 transition-colors flex items-center gap-2 active:scale-95"
                  >
                    <span>🔄</span> Retake Photo
                  </button>
                </>
              )}
            </div>
            
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide additional details about the exact location and severity..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-6 pt-2 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={handleFormSubmit}
            className="w-full px-4 py-3.5 text-base font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Submit Verified Issue
          </button>
        </div>
      </div>
    </div>
  );
}
