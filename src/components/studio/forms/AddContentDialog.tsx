"use client";

import { X, Briefcase, GraduationCap, Wrench, FolderGit2, Sparkles, Languages, Award, LayoutTemplate } from "lucide-react";

interface AddContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sectionId: string) => void;
  addedSections: string[];
}

export function AddContentDialog({ isOpen, onClose, onSelect, addedSections }: AddContentDialogProps) {
  if (!isOpen) return null;

  const contentTypes = [
    { id: "education", title: "Education", description: "Show your degrees and academic achievements.", icon: GraduationCap },
    { id: "skills", title: "Skills", description: "List your technical and soft skills.", icon: Wrench },
    { id: "projects", title: "Projects", description: "Highlight your key projects.", icon: FolderGit2 },
    { id: "customSections", title: "Custom Section", description: "Create your own section like Awards, Languages, etc.", icon: Sparkles },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add Content</h2>
            <p className="text-sm text-slate-500 mt-1">Select a section to add to your resume</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contentTypes.map((type) => {
              const Icon = type.icon;
              // If it's not customSections and it's already added, we might want to disable it.
              // For simplicity, we just allow selecting it (it will open the existing section).
              const isAdded = addedSections.includes(type.id) && type.id !== "customSections";

              return (
                <button
                  key={type.id}
                  onClick={() => {
                    onSelect(type.id);
                    onClose();
                  }}
                  className="flex items-start text-left gap-4 p-4 rounded-xl border border-slate-200 hover:border-pink-500 hover:shadow-md hover:-translate-y-0.5 transition-all group bg-white"
                >
                  <div className="p-3 rounded-lg bg-pink-50 text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      {type.title}
                      {isAdded && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          Added
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{type.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
