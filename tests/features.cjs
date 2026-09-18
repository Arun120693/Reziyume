require('./register.cjs');
const assert = require('node:assert/strict');
const { planPages } = require('../src/lib/export/pagination.ts');
assert.deepEqual(planPages(250,100,[{top:90,bottom:115}]),[0,90,190,250]);
assert.deepEqual(planPages(250,100,[{top:90,bottom:115},{top:80,bottom:95}]),[0,80,180,250]);
assert.deepEqual(planPages(200,100,[]),[0,100,200]);
assert.throws(() => planPages(200,100,[{top:0,bottom:150}]), /taller than a page/);
for(let height=1;height<4000;height+=17) { const cuts=planPages(height,100,[]); assert.equal(cuts[0],0); assert.equal(cuts.at(-1),height); assert.equal(cuts.slice(1).reduce((total,end,i)=>total+end-cuts[i],0),height); }
const { resumeSnapshotSchema } = require('../src/lib/resumeSnapshot.ts');
const { dummyResumeData } = require('../src/lib/dummyData.ts');
const snapshot = resumeSnapshotSchema.parse({...dummyResumeData,userId:'other',isPublic:true,shareToken:'secret'});
assert.equal(snapshot.userId,undefined); assert.equal(snapshot.shareToken,undefined); assert.equal(snapshot.isPublic,undefined);
const { jobApplicationSchema } = require('../src/lib/jobApplication.ts');
assert.equal(jobApplicationSchema.safeParse({company:'A',role:'B',url:'javascript:alert(1)',status:'Saved',notes:'',appliedAt:null}).success,false);
const { resumeExamples, exampleResume } = require('../src/lib/resumeExamples.ts');
for(const example of resumeExamples) assert.ok(resumeSnapshotSchema.safeParse(exampleResume(example.id)).success);
assert.equal(exampleResume('missing'),null);
console.log('PASS: contiguous pagination, multi-column protected bands, oversize handling, private snapshots, URL validation, and all 8 examples.');
