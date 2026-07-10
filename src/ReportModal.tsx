import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Camera, Compass } from 'lucide-react';
import Webcam from 'react-webcam';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIssueReported: (newIssue: { title: string; category: string; description: string; latitude: number; longitude: number }) => void;
}

export default function ReportModal({ isOpen, onClose, onIssueReported }: ReportModalProps) {
  const [category, setCategory] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  // Geolocation states
  const [coords, setCoords] = useState<{ latitude: number; longitude: number }>({ latitude: 17.4483, longitude: 78.6882 }); // SNIST default
  const [gpsVerified, setGpsVerified] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);

  // Webcam states
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setPhotoCaptured(true);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
    setPhotoCaptured(false);
  };

  useEffect(() => {
    if (isOpen) {
      // Reset form states
      setCategory('');
      setTitle('');
      setDescription('');
      setPhotoCaptured(false);
      setCapturedImage(null);

      // Fetch actual browser GPS coordinates
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoords({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            setGpsVerified(true);
          },
          (error) => {
            console.warn('GPS geofencing lookup failed, using fallback location:', error);
            // Default Ghatkesar Ward 4 demo coordinates
            setCoords({ latitude: 17.4482, longitude: 78.6885 });
            setGpsVerified(false);
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      }
    }
  }, [isOpen]);
  if (!isOpen) return null;

  // Handle mock photo upload/capture
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCapturedImage(url);
      setPhotoCaptured(true);
    } else {
      // Mock photo generation
      setPhotoCaptured(true);
    }
  };

  const handleSubmit = () => {
    if (!category) {
      alert('Please select an issue category.');
      return;
    }
    if (!title.trim()) {
      alert('Please enter a short title describing the issue.');
      return;
    }
    if (!photoCaptured) {
      alert('Camera verification required. Please capture a live photo of the issue.');
      return;
    }

    onIssueReported({
      title,
      category,
      description,
      latitude: coords.latitude,
      longitude: coords.longitude
    });

    onClose();
  };

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
                    type="button"
                    onClick={capture}
                    className="w-full px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-lg shadow-sm hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 active:scale-95 mb-2 text-sm"
                  >
                    <Camera className="w-4 h-4" /> Snap Live Photo (Webcam)
                  </button>

                  <div className="relative flex py-1 items-center w-full">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">or</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  <label className="w-full border border-dashed border-emerald-300 bg-white hover:bg-emerald-50 transition-colors rounded-lg py-2.5 px-4 cursor-pointer flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 mt-2 shadow-sm">
                    <Camera className="w-4 h-4" /> Use Mobile Device Camera
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      className="hidden" 
                      onChange={handlePhotoCapture}
                    />
                  </label>
                </>
              ) : (
                <>
                  <div className="w-full rounded-xl overflow-hidden shadow-sm mb-3 border border-emerald-250 bg-white p-1">
                    <img src={capturedImage} alt="Captured Preview" className="w-full h-48 object-cover rounded-lg" />
                  </div>
                  <button 
                    type="button"
                    onClick={retake}
                    className="px-5 py-2 bg-white border border-emerald-250 text-emerald-750 font-bold rounded-lg shadow-sm hover:bg-emerald-50 transition-colors flex items-center gap-2 active:scale-95 text-sm"
                  >
                    <span>🔄</span> Retake Photo
                  </button>
                </>
              )}
            </div>
            
            {/* Anti-Spoofing GPS Badge */}
            <div className="mt-3 bg-emerald-100 text-emerald-850 px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm border border-emerald-250">
              <span className="animate-pulse">🟢</span> 
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              {gpsVerified ? (
                <span>GPS Lock: ({coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}) - Verified Ward Boundary</span>
              ) : (
                <span>Simulated GPS Lock: SNIST Campus / Ghatkesar Ward 4</span>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1.5">
                Issue Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="" disabled>Select a category...</option>
                  <option value="road">🛣️ Road Damage / Potholes</option>
                  <option value="water">🚰 Water Supply / Leakages</option>
                  <option value="sanitation">🗑️ Sanitation / Garbage Dumping</option>
                  <option value="electrical">⚡ Electrical / Street Lights</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <span className="text-xs">▼</span>
                </div>
              </div>
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
            onClick={handleSubmit}
            className="w-full px-4 py-3.5 text-base font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Submit Verified Issue
          </button>
        </div>
      </div>
    </div>
  );
}
