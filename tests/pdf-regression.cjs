require('./register.cjs');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const React = require('react');
const { templates } = require('../src/components/studio/preview/templates/registry.ts');
const { dummyResumeData } = require('../src/lib/dummyData.ts');
const { PdfDocument } = require('../src/components/pdf/PdfDocument.tsx');
(async () => {
  const { renderToBuffer } = await import('@react-pdf/renderer');
  const { PDFParse } = require('pdf-parse');
  fs.mkdirSync('/tmp/reziyume-pdf-regression',{recursive:true});
  const data = {...dummyResumeData, experience: Array.from({length:8},(_,i)=>({...dummyResumeData.experience[0],id:`job${i}`,position:`UniqueDesignation${i}`,description:`<ul>${Array.from({length:i===0?35:8},(_,j)=>`<li>UniqueBullet${i}X${j} delivered reliable reporting with colleagues across product and operations teams.</li>`).join('')}</ul>`}))};
  let count=0;
  for(const config of templates) for(const pageSize of ['A4','LETTER']) {
    const buffer=await renderToBuffer(React.createElement(PdfDocument,{data,config:{...config,layout:'single-column'},pageSize}));
    const parser=new PDFParse({data:buffer}); const result=await parser.getText(); await parser.destroy();
    assert.ok(result.total>=3, `${config.id}: long document paginated`);
    for(let i=0;i<8;i++) {
      assert.equal(result.text.split(`UniqueDesignation${i}`).length-1,1, `${config.id}: designation once`);
      for(let j=0;j<(i===0?35:8);j++) assert.equal((result.text.match(new RegExp(`UniqueBullet${i}X${j}(?![0-9])`,'g'))||[]).length,1, `${config.id}: bullet ${i}/${j} once`);
      const page=result.pages.find(p=>p.text.includes(`UniqueDesignation${i}`));
      assert.ok(page.text.includes(`UniqueBullet${i}X0`),`${config.id}: heading with first bullet`);
    }
    fs.writeFileSync(`/tmp/reziyume-pdf-regression/${config.id}-${pageSize}.pdf`,buffer); count++;
  }
  console.log(`PASS: ${count} long text PDFs: every designation and bullet appears exactly once; headings stay with their first bullet.`);
})().catch(e=>{console.error(e);process.exitCode=1;});
