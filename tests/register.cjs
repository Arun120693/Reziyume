const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (mod,file) => mod._compile(ts.transpileModule(fs.readFileSync(file,'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText, file);
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request,...rest) { return resolve.call(this, request.startsWith('@/') ? path.join(__dirname,'../src',request.slice(2)) : request,...rest); };
