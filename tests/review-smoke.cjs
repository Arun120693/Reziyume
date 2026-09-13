/* Run with node tests/review-smoke.cjs. Uses the project's existing TypeScript runtime. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
for (const ext of ['.ts', '.tsx']) {
  require.extensions[ext] = (mod, file) => mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2020 },
  }).outputText, file);
}
const original = Module._resolveFilename;
Module._resolveFilename = function(request, ...rest) {
  return original.call(this, request.startsWith('@/') ? path.join(root, 'src', request.slice(2)) : request, ...rest);
};
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { templates, getTemplateConfig } = require('../src/components/studio/preview/templates/registry.ts');
const { CoreTemplate } = require('../src/components/studio/preview/templates/CoreTemplate.tsx');
const { dummyResumeData } = require('../src/lib/dummyData.ts');
const { defaultResumeData } = require('../src/lib/types/resume.ts');
assert.equal(new Set(templates.map(t => t.id)).size, templates.length);
assert.ok(templates.some(t => t.id === defaultResumeData.templateId));
assert.equal(getTemplateConfig('legacy-unknown').id, 'onyx');
for (const config of templates) {
  const html = renderToStaticMarkup(React.createElement(CoreTemplate, { config, data: {...dummyResumeData, templateId: config.id} }));
  assert.ok(html.includes('James') && html.includes('Appleseed'), `${config.id} renders contact`);
  assert.ok(html.includes('Barnes'), `${config.id} renders experience`);
  const empty = renderToStaticMarkup(React.createElement(CoreTemplate, { config, data: {...dummyResumeData, ...defaultResumeData, templateId: config.id} }));
  assert.ok(empty.length > 0, `${config.id} renders blank resume`);
}
console.log(`PASS: ${templates.length} templates render populated and empty resumes; identifiers and fallback valid.`);
(async () => {
  const { renderToBuffer } = await import('@react-pdf/renderer');
  const { PdfDocument } = require('../src/components/pdf/PdfDocument.tsx');
  fs.mkdirSync('/tmp/reziyume-qa', { recursive: true });
  for (const config of templates.filter(t => t.featured)) {
    const data = { ...dummyResumeData, summary: '<p>Build <strong>reliable</strong> products &amp; teams.</p>', templateId:config.id };
    const buffer = await renderToBuffer(React.createElement(PdfDocument, { data, config: {...config,layout:'single-column'} }));
    assert.ok(buffer.length > 1000);
    fs.writeFileSync(`/tmp/reziyume-qa/${config.id}.pdf`, buffer);
  }
  console.log('PASS: all six new templates export to text PDFs.');
})().catch(error => { console.error(error); process.exitCode = 1; });

// Verify the deletion route never deletes another user's resume or writes without a session.
(async () => {
  const originalLoad = Module._load;
  let session = null;
  let lastWhere;
  Module._load = function(request, ...args) {
    if (request === 'next-auth') return { getServerSession: async () => session };
    if (request === '@/lib/auth') return { authOptions: {} };
    if (request === '@/lib/prisma') return { __esModule:true, default:{ resume:{deleteMany:async ({where}) => {lastWhere = where; return {count:where.id === 'owned' ? 1 : 0};}}}};
    return originalLoad.call(this, request, ...args);
  };
  const { DELETE } = require('../src/app/api/resumes/[id]/route.ts');
  Module._load = originalLoad;
  let response = await DELETE(new Request('http://localhost/api/resumes/owned'), {params:Promise.resolve({id:'owned'})});
  assert.equal(response.status,401);
  assert.equal(lastWhere,undefined);
  session = {user:{id:'user-1'}};
  response = await DELETE(new Request('http://localhost/api/resumes/owned'), {params:Promise.resolve({id:'owned'})});
  assert.equal(response.status,200);
  assert.deepEqual(lastWhere,{id:'owned',userId:'user-1'});
  response = await DELETE(new Request('http://localhost/api/resumes/other'), {params:Promise.resolve({id:'other'})});
  assert.equal(response.status,404);
  console.log('PASS: deletion requires authentication and scopes every write to the owner.');
})().catch(error => { console.error(error); process.exitCode = 1; });
