"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";
import { Bot } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorId = useMemo(() => `editor-${Math.random().toString(36).substr(2, 9)}`, []);

  const modules = useMemo(() => ({
    toolbar: `#${editorId}-toolbar`,
  }), [editorId]);

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-pink-500 focus-within:ring-1 focus-within:ring-pink-500 transition-shadow">
        <div id={`${editorId}-toolbar`} className="flex items-center gap-1 border-b border-slate-200 px-3 py-2 bg-slate-50/50">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <div className="w-px h-4 bg-slate-300 mx-2" />
          <button className="ql-list" value="bullet" />
          <button className="ql-link" />
          <div className="w-px h-4 bg-slate-300 mx-2" />
          <button className="ql-align" value="" />
          <button className="ql-align" value="center" />
          <button className="ql-align" value="right" />
          <button className="ql-align" value="justify" />
        </div>
        <ReactQuill 
          theme="snow" 
          value={value} 
          onChange={onChange} 
          modules={modules}
          placeholder={placeholder}
          className="border-none [&_.ql-container]:border-none [&_.ql-editor]:min-h-[120px] [&_.ql-toolbar]:hidden"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
          <Bot className="w-5 h-5" />
        </div>
        <button type="button" className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors">
          Improve Writing
        </button>
        <button type="button" className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors">
          Suggest Content
        </button>
        <button type="button" className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors">
          Grammar Check
        </button>
        <button type="button" className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors">
          Shorter
        </button>
      </div>
    </div>
  );
}
