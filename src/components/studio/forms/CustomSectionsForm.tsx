"use client";

import { useResumeStore } from "@/lib/store/useResumeStore";
import { Plus, Trash2, Check, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { MonthYearSelector } from "./MonthYearSelector";
import { v4 as uuidv4 } from "uuid";
import { RichTextEditor } from "./RichTextEditor";
import { CustomSection, CustomSectionItem } from "@/lib/types/resume";

export function CustomSectionsForm({ onClose }: { onClose?: () => void }) {
  const customSections = useResumeStore((state) => state.data?.customSections) || [];
  const addCustomSection = useResumeStore((state) => state.addCustomSection);
  const updateCustomSection = useResumeStore((state) => state.updateCustomSection);
  const removeCustomSection = useResumeStore((state) => state.removeCustomSection);

  const handleAddSection = () => {
    const newSection: CustomSection = {
      id: uuidv4(),
      title: "New Custom Section",
      items: [],
    };
    addCustomSection(newSection);
  };

  const handleAddItem = (sectionId: string) => {
    const section = customSections.find((s) => s.id === sectionId);
    if (!section) return;

    const newItem: CustomSectionItem = {
      id: uuidv4(),
      name: "",
      subtitle: "",
      startDate: "",
      endDate: "",
      description: "",
    };

    updateCustomSection(sectionId, { items: [...(section.items || []), newItem] });
  };

  const handleUpdateItem = (sectionId: string, itemId: string, field: keyof CustomSectionItem, value: string) => {
    const section = customSections.find((s) => s.id === sectionId);
    if (!section) return;

    const newItems = section.items.map((item) => 
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateCustomSection(sectionId, { items: newItems });
  };

  const handleRemoveItem = (sectionId: string, itemId: string) => {
    const section = customSections.find((s) => s.id === sectionId);
    if (!section) return;

    const newItems = section.items.filter((item) => item.id !== itemId);
    updateCustomSection(sectionId, { items: newItems });
  };

  const inputClass = "w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 focus:bg-white border-2 border-transparent focus:border-pink-500 rounded-lg outline-none transition-colors sm:text-sm text-slate-800 placeholder-slate-400";
  const labelClass = "block text-sm font-semibold text-slate-800 mb-1.5";

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 overflow-y-auto p-8 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Custom Sections</h2>
        </div>

        <div className="space-y-12">
          {customSections.map((section) => (
            <div key={section.id} className="relative group bg-white border-2 border-slate-100 rounded-2xl p-6">
              <button
                onClick={() => removeCustomSection(section.id)}
                className="absolute -top-3 -right-3 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                title="Remove entire section"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Section Title</label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateCustomSection(section.id, { title: e.target.value })}
                    className={inputClass + " font-bold text-lg"}
                    placeholder="e.g., Certifications, Languages"
                  />
                </div>

                {/* Items List */}
                <div className="space-y-6 mt-6 pl-4 border-l-2 border-slate-100">
                  {(section.items || []).map((item) => (
                    <div key={item.id} className="relative group bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <button
                        onClick={() => handleRemoveItem(section.id, item.id)}
                        className="absolute -top-3 -right-3 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-1">
                          <label className={labelClass}>Name / Title</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleUpdateItem(section.id, item.id, "name", e.target.value)}
                            className={inputClass}
                            placeholder="e.g., AWS Certified Solutions Architect"
                          />
                        </div>

                        <div className="md:col-span-1">
                          <label className={labelClass}>Subtitle / Organization</label>
                          <input
                            type="text"
                            value={item.subtitle}
                            onChange={(e) => handleUpdateItem(section.id, item.id, "subtitle", e.target.value)}
                            className={inputClass}
                            placeholder="e.g., Amazon Web Services"
                          />
                        </div>

                        <div className="md:col-span-1">
                          <label className={labelClass}>Start Date</label>
                          <MonthYearSelector
                            value={item.startDate}
                            onChange={(val) => handleUpdateItem(section.id, item.id, "startDate", val)}
                          />
                        </div>

                        <div className="md:col-span-1">
                          <label className={labelClass}>End Date</label>
                          <MonthYearSelector
                            value={item.endDate}
                            onChange={(val) => handleUpdateItem(section.id, item.id, "endDate", val)}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className={labelClass}>Description</label>
                          <div className="border-2 border-transparent focus-within:border-pink-500 rounded-lg overflow-hidden bg-slate-100 transition-colors">
                            <RichTextEditor 
                              value={item.description}
                              onChange={(val) => handleUpdateItem(section.id, item.id, "description", val)}
                              placeholder="Add details..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-2">
                    <button
                      onClick={() => handleAddItem(section.id)}
                      className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item to {section.title || "Section"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {customSections.length === 0 && (
             <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
               <p className="text-slate-500 mb-4">No custom sections added yet.</p>
               <button
                 onClick={handleAddSection}
                 className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
               >
                 <Plus className="h-4 w-4 mr-2" />
                 Add Custom Section
               </button>
             </div>
          )}
          
          {customSections.length > 0 && (
             <div className="flex justify-center mt-8">
              <button
                onClick={handleAddSection}
                className="inline-flex items-center text-sm font-semibold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-6 py-3 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add entirely new section
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-slate-200/50">
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-12 py-3 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Check className="w-5 h-5" />
          Done
        </button>
      </div>
    </div>
  );
}
