import {
  AlertTriangle,
  Camera,
  Check,
  Info,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORY_INFO, HOSTEL_BLOCKS } from '../../data/mockData';
import { ComplaintCategory, ComplaintPriority } from '../../types';
import { CategoryIcon } from '../Common/CategoryIcon';

interface NewComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (ticketId: string) => void;
}

export const NewComplaintModal: React.FC<NewComplaintModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createComplaint, activeStudent } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('electrical');
  const [priority, setPriority] = useState<ComplaintPriority>('normal');
  const [block, setBlock] = useState(activeStudent.block);
  const [floor, setFloor] = useState<number>(activeStudent.floor);
  const [roomNumber, setRoomNumber] = useState(activeStudent.roomNumber);
  const [bedNo, setBedNo] = useState('Bed 1');
  const [preferredSlot, setPreferredSlot] = useState('Morning (09:00 - 12:00)');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSelfCheck, setShowSelfCheck] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = createComplaint({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        block,
        floor,
        roomNumber: roomNumber.trim(),
        bedNo,
        preferredSlot,
        imageUrl: imagePreview || undefined,
      });

      setIsSubmitting(false);
      onClose();
      if (onSuccess) {
        onSuccess(created.id);
      }
    }, 400);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getSmartTip = () => {
    switch (category) {
      case 'wifi':
        return 'Campus Wi-Fi Tip: If login fails, disconnect from "Campus_Hostel_5G", clear captive portal cache, or connect via LAN port beside your desk.';
      case 'electrical':
        return 'Electrical Safety: If an entire switchboard went dead, check if the mini MCB switch near your room door tripped before filing.';
      case 'plumbing':
        return 'Plumbing Note: If water is overflowing rapidly, turn the angle shutoff valve clockwise located beneath the basin.';
      default:
        return 'Hostel warden office assigns maintenance tickets within 2 hours on business days.';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Log Hostel Grievance / Maintenance</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filing ticket for {activeStudent.name} (Roll: {activeStudent.studentId})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Category Selection Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {(Object.keys(CATEGORY_INFO) as ComplaintCategory[]).map((catKey) => {
                const info = CATEGORY_INFO[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    type="button"
                    key={catKey}
                    onClick={() => setCategory(catKey)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs font-medium'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={isSelected ? 'text-emerald-400' : 'text-slate-500'}>
                      <CategoryIcon category={catKey} className="w-4 h-4" />
                    </div>
                    <span className="truncate">{info.label.split('&')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Smart Tip Notice */}
          {showSelfCheck && (
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-900 leading-relaxed flex-1">
                {getSmartTip()}
              </div>
              <button
                type="button"
                onClick={() => setShowSelfCheck(false)}
                className="text-indigo-400 hover:text-indigo-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Issue Headline *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Geyser switch sparking / Tubelight dead / Washbasin tap dripping"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>

          {/* Room Location & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hostel Block
              </label>
              <select
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              >
                {HOSTEL_BLOCKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Room No / Wing
              </label>
              <input
                type="text"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. 304 or Washroom W-2"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Urgency Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              >
                <option value="low">Low (Cosmetic/Non-urgent)</option>
                <option value="normal">Normal (Routine Maintenance)</option>
                <option value="high">High (Hindering Study/Rest)</option>
                <option value="emergency">Emergency (Leak/Spark/Hazard)</option>
              </select>
            </div>
          </div>

          {/* Preferred Inspection Slot & Bed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Technician Visit Slot
              </label>
              <select
                value={preferredSlot}
                onChange={(e) => setPreferredSlot(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              >
                <option value="Morning (09:00 - 12:00)">Morning (09:00 - 12:00)</option>
                <option value="Afternoon (14:00 - 17:00)">Afternoon (14:00 - 17:00)</option>
                <option value="Evening (17:00 - 20:00)">Evening (17:00 - 20:00)</option>
                <option value="Anytime Student In Room">Anytime Student In Room</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bed / Work Area
              </label>
              <select
                value={bedNo}
                onChange={(e) => setBedNo(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              >
                <option value="Bed 1">Bed 1 (Window side)</option>
                <option value="Bed 2">Bed 2 (Door side)</option>
                <option value="Bed 3">Bed 3 (Center)</option>
                <option value="Common Room Area">Common Room Area / Ceiling</option>
                <option value="Attached Washroom">Attached Washroom</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Specific Problem Details *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe what is broken, what sounds/signs you observed, and when it started..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Optional Photo Attachment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Attachment Photo (Optional)
            </label>
            {imagePreview ? (
              <div className="relative inline-block border border-slate-200 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Complaint evidence"
                  className="w-32 h-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-1 hover:bg-slate-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  <Camera className="w-4 h-4 text-slate-500" />
                  <span>Attach Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-400">JPG, PNG up to 5MB</span>
              </div>
            )}
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !description.trim()}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2 shadow-xs"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Submit Grievance</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
