"use client";

import { useState, useEffect } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { PhotoCropper } from "./PhotoCropper";
import { Lightbulb, Check, Loader2 } from "lucide-react";
import { getTemplateConfig } from "@/components/studio/preview/templates/registry";

export function PersonalDetailsForm({ onClose }: { onClose?: () => void }) {
  const contact = useResumeStore((state) => state.data?.contact);
  const templateId = useResumeStore((state) => state.data?.templateId);
  const updateContact = useResumeStore((state) => state.updateContact);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  if (!contact) return null;

  const templateConfig = getTemplateConfig(templateId || "");
  const showPhotoUpload = templateConfig.supportsPhoto;

  useEffect(() => {
    return () => {
      if (cropImageSrc && cropImageSrc.startsWith("blob:")) {
        URL.revokeObjectURL(cropImageSrc);
      }
    };
  }, [cropImageSrc]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateContact({ [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingPhoto(true);
      let processedBlob: Blob = file;

      try {
        // Check if it's a HEIC file (either by mime type, extension, or magic bytes if renamed)
        const isHeicMime = file.type === 'image/heic' || file.type === 'image/heif';
        const isHeicExt = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
        
        const buffer = await file.slice(0, 16).arrayBuffer();
        const arr = new Uint8Array(buffer);
        const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
        const isHeicMagic = hex.includes('66747970'); // 'ftyp'

        if (isHeicMime || isHeicExt || isHeicMagic) {
          const formData = new FormData();
          formData.append("file", file);
          
          const response = await fetch("/api/convert-heic", {
            method: "POST",
            body: formData,
          });
          
          if (!response.ok) throw new Error("Failed to convert HEIC image");
          processedBlob = await response.blob();
        }

        const imageUrl = URL.createObjectURL(processedBlob);
        setCropImageSrc(imageUrl);
      } catch (error) {
        console.error("Error processing image upload:", error);
        alert("Failed to process image. Please try uploading a different format like JPG or PNG.");
      } finally {
        setIsUploadingPhoto(false);
        // Reset input so the same file can be selected again if needed
        e.target.value = "";
      }
    }
  };

  const handleCropComplete = (croppedBase64: string) => {
    updateContact({ photoBase64: croppedBase64 });
    setCropImageSrc(null);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all neo-input";
  const labelClass = "block text-sm font-semibold mb-1.5";
  const labelStyle = { color: "#4a4760" };

  return (
    <div className="flex flex-col h-full relative" style={{ background: "var(--bg-base)" }}>
      <div className="flex-1 overflow-y-auto p-8 pb-28">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: "#111111" }}>Personal Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6 md:col-span-1">
            <div>
              <label className={labelClass} style={labelStyle}>Full name</label>
              <input
                type="text"
                name="fullName"
                value={contact.fullName}
                onChange={handleChange}
                className={inputClass}
                style={{ color: "#111111" }}
                placeholder="Enter your first- and last name"
              />
            </div>

            <div>
              <label className={labelClass} style={labelStyle}>Professional title</label>
              <input
                type="text"
                name="jobTitle"
                value={contact.jobTitle}
                onChange={handleChange}
                className={inputClass}
                style={{ color: "#111111" }}
                placeholder="Target position or current role"
              />
            </div>
          </div>

          <div className="md:col-span-1 flex flex-col">
            {showPhotoUpload ? (
              <>
                <label className={labelClass} style={labelStyle}>Photo</label>
                <div className="flex-1 flex flex-col items-start gap-4">
                   {contact.photoBase64 ? (
                    <div className="relative group">
                      {isUploadingPhoto && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 rounded-full">
                          <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                        </div>
                      )}
                      <img src={contact.photoBase64} alt="Preview" className={`w-32 h-32 rounded-full object-cover border border-slate-200 shadow-sm ${isUploadingPhoto ? 'opacity-50' : ''}`} />
                      <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <label className="text-xs text-white font-medium cursor-pointer hover:underline">
                          Change
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={isUploadingPhoto} />
                        </label>
                        <button 
                          type="button" 
                          onClick={() => updateContact({ photoBase64: "" })}
                          className="text-xs text-white font-medium hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className={`w-32 h-32 rounded-full bg-slate-100 hover:bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer transition-colors group relative ${isUploadingPhoto ? 'opacity-70 cursor-not-allowed' : ''}`}>
                      {isUploadingPhoto ? (
                        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                      ) : (
                        <div className="text-slate-400 group-hover:text-slate-500">
                          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={isUploadingPhoto} />
                    </label>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-start gap-3 p-4 rounded-xl text-[12px] font-medium"
                style={{ background: "rgba(255,190,80,0.12)", border: "1px solid rgba(255,190,80,0.35)", color: "#8a6a00" }}
              >
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>Photo upload is only available for photo-compatible templates. Switch to a <strong>Portrait, Lumiere, Herald, Vogue, Nova</strong> or <strong>Atelier</strong> template to add your photo.</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass} style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={contact.email}
              onChange={handleChange}
              className={inputClass}
              style={{ color: "#111111" }}
              placeholder="Enter email"
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass} style={labelStyle}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={contact.phone}
              onChange={handleChange}
              className={inputClass}
              style={{ color: "#111111" }}
              placeholder="Enter Phone"
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass} style={labelStyle}>Location</label>
            <input
              type="text"
              name="location"
              value={contact.location}
              onChange={handleChange}
              className={inputClass}
              style={{ color: "#111111" }}
              placeholder="City, State"
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass} style={labelStyle}>LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={contact.linkedin}
              onChange={handleChange}
              className={inputClass}
              style={{ color: "#111111" }}
              placeholder="linkedin.com/in/johndoe"
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass} style={labelStyle}>Website</label>
            <input
              type="url"
              name="website"
              value={contact.website}
              onChange={handleChange}
              className={inputClass}
              style={{ color: "#111111" }}
              placeholder="johndoe.com"
            />
          </div>
        </div>

        {cropImageSrc && (
          <PhotoCropper 
            imageSrc={cropImageSrc} 
            onCropComplete={handleCropComplete} 
            onCancel={() => setCropImageSrc(null)} 
          />
        )}
      </div>
      
      {/* Sticky Bottom Bar */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4"
        style={{
          background: "rgba(235,233,245,0.85)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255,255,255,0.6)"
        }}
      >
        <button
          onClick={onClose}
          className="accent-btn w-full sm:w-auto px-12 py-3 font-semibold flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          Done
        </button>
      </div>
    </div>
  );
}

