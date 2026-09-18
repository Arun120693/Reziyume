"use client";
import { useState } from "react";
import { templates } from "../src/components/studio/preview/templates/registry";
import { CoreTemplate } from "../src/components/studio/preview/templates/CoreTemplate";
import { dummyResumeData } from "../src/lib/dummyData";
import { captureResume } from "../src/lib/export/captureResume";
import { createVisualPdf } from "../src/lib/export/createVisualPdf";
import { measureProtectedBands, planPages } from "../src/lib/export/pagination";

const data = { ...dummyResumeData, skills: Array.from({length:35},(_,i)=>({id:`s${i}`,name:`Professional skill ${i+1}`,level:""})), experience: Array.from({length:7},(_,i)=>({...dummyResumeData.experience[0],id:`job${i}`,position:`Designation ${i+1}`,description:`<ul>${Array.from({length:i===0?20:8},(_,j)=>`<li>Achievement ${i+1}.${j+1}: Delivered reliable campaign reporting with product and operations teams, documenting decisions and measuring outcomes.</li>`).join("")}</ul>`})) };
export default function VisualFixture() {
  const [index,setIndex]=useState(0);
  const [results,setResults]=useState<string[]>([]);
  const [pages,setPages]=useState<string[]>([]);
  const [busy,setBusy]=useState(false);
  async function run() {
    setBusy(true);setResults([]);
    for(let i=0;i<templates.length;i++) {
      setIndex(i);
      await new Promise(resolve=>setTimeout(resolve,150));
      try {
        await document.fonts.ready;
        const element=document.getElementById("visual-fixture")!;
        const width=element.getBoundingClientRect().width;
        const bands=measureProtectedBands(element);
        const canvas=await captureResume(element);
        const cuts=planPages(canvas.height,canvas.width*281/194,bands.map(b=>({top:b.top*canvas.width/width,bottom:b.bottom*canvas.width/width})));
        for(const pageSize of ["a4","letter"] as const) {
          const pdf=createVisualPdf(canvas,{pageSize,bands,measuredWidth:width});
          const response=await fetch(`/api/qa-pdf?name=${templates[i].id}-${pageSize}`,{method:"POST",body:pdf});
          if(!response.ok) throw new Error("Could not save test PDF");
        }
        if(templates[i].layout==="photo-overlap-green") {
          const images=[];
          for(let p=0;p<cuts.length-1;p++) { const c=document.createElement("canvas");c.width=canvas.width;c.height=cuts[p+1]-cuts[p];c.getContext("2d")!.drawImage(canvas,0,cuts[p],canvas.width,c.height,0,0,canvas.width,c.height);images.push(c.toDataURL()); }
          setPages(images);
        }
        setResults(r=>[...r,`PASS ${templates[i].name}: ${cuts.length-1} pages, A4 + Letter`]);
      } catch(e) {setResults(r=>[...r,`FAIL ${templates[i].name}: ${(e as Error).message}`]);}
    }
    setBusy(false);
  }
  return <main className="p-8"><h1>Visual PDF regression fixture — fictional data only</h1><button className="my-4 rounded bg-black p-4 text-white" disabled={busy} onClick={run}>{busy?"Running all templates…":"Run all templates"}</button><pre className="whitespace-pre-wrap">{results.join("\n")}</pre><h2>Forest page slices</h2><div className="flex flex-wrap gap-4">{pages.map((p,i)=><img key={i} alt={`Forest page ${i+1}`} src={p} style={{width:380,border:"1px solid #333"}}/>)}</div><div id="visual-fixture" style={{width:794,marginTop:30}}><CoreTemplate data={{...data,templateId:templates[index].id}} config={templates[index]}/></div></main>;
}
