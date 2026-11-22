const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const files=[...html.matchAll(/<script src="([^"?]+)/g)].map(m=>m[1]);
const storage={};
const context={window:{},document:{documentElement:{style:{setProperty(){}}},body:{classList:{toggle(){}}}},localStorage:{getItem(k){return storage[k]||null},setItem(k,v){storage[k]=v}},console,Math,Set};
vm.createContext(context);
for(const file of files){const src=fs.readFileSync(path.join(root,file),'utf8');new vm.Script(src,{filename:file});if(!file.endsWith('/app.js'))vm.runInContext(src,context,{filename:file})}
const w=context.window,errors=[],stats={modules:0,chapters:0,tutors:0,characters:0,workedCases:Object.keys(w.LESSON_CASES).length,interactiveDemos:Object.values(w.DEMOS).filter(d=>!d.kind).length,checkpoints:0,diagramGroups:Object.keys(w.DIAGRAMS).length,figureGroups:Object.keys(w.FIGURES).length,storyPanels:Object.values(w.FIGURES).reduce((n,f)=>n+(f.cards||[]).length,0)};
const routes=[];
for(const [id,m]of Object.entries(w.CONTENT)){stats.modules++;for(const ch of m.chapters){stats.chapters++;stats.tutors+=!!ch.tutor;stats.characters+=ch.content.length;routes.push(`#/m/${id}/${ch.id}`);for(const match of ch.content.matchAll(/```(demo|figure|diagram):([^\s]+)/g)){const db=w[{demo:'DEMOS',figure:'FIGURES',diagram:'DIAGRAMS'}[match[1]]];if(!db[match[2]])errors.push(`${id}/${ch.id}: missing ${match[0]}`)}const result=w.MD.render(ch.content);if(!result.html||!result.toc.length)errors.push(`${id}/${ch.id}: empty render`);if(!w.DEMOS[`knowledge-${id}-${ch.id}`])errors.push(`${id}/${ch.id}: missing check`);else stats.checkpoints++;}}
for(const match of html.matchAll(/(?:src|href)="(assets\/[^"?]+)/g))if(!fs.existsSync(path.join(root,match[1])))errors.push('missing asset '+match[1]);
// A story must be explicitly approved for the chapter that embeds it. Similar
// category names do not establish relevance (e.g. scams vs cyberbullying).
stats.storyBindings=0;
for(const [moduleId,m]of Object.entries(w.CONTENT))for(const ch of m.chapters){
  for(const match of ch.content.matchAll(/```figure:(study-[^\s]+)/g)){
    stats.storyBindings++;
    const figure=w.FIGURES[match[1]],route=moduleId+'/'+ch.id;
    if(!figure||!(figure.chapters||[]).includes(route))errors.push('unapproved story binding '+route+': '+match[1]);
  }
}
for(const [id,figure]of Object.entries(w.FIGURES).filter(([id])=>id.startsWith('study-'))){
  if(figure.cards.length!==4||figure.cards.some(c=>!c.caption||!c.svg.includes('aria-label="')))errors.push('incomplete story '+id);
  const drawings=figure.cards.map(c=>c.svg.replace(/aria-label="[^"]*"/g,''));
  if(new Set(drawings).size!==drawings.length)errors.push('duplicate story drawings '+id);
}
for(const [moduleId,chapterId,expected]of [['safety','ch09','study-cyberbullying'],['safety','ch11','study-account-security'],['csp','ch04','study-tone']]){
  if(!w.CONTENT[moduleId].chapters.find(c=>c.id===chapterId).content.includes('figure:'+expected))errors.push('missing topic-specific story '+moduleId+'/'+chapterId);
}
let missingArtRejected=false;
try{w.LEARNING_VISUALS.sketch('unknown-story-type',0);}catch{missingArtRejected=true;}
if(!missingArtRejected)errors.push('unknown story type silently uses fallback artwork');
for(const f of ['postal-line.png','postal-flat.png','postal-shadow.png','postal-finish.png','postal-editable.svg','postal-guide.html','cel-postal-practice.zip'])if(!fs.existsSync(path.join(root,'assets/practice',f)))errors.push('missing practice '+f);
// Image lessons must resolve to actual, distinct PNGs and approved chapter routes.
// A changed caption alone must never count as a new process illustration.
const crypto=require('crypto'),processCases=w.PROCESS_CASES||{},processManifest=JSON.parse(fs.readFileSync(path.join(root,'assets/process/manifest.json'),'utf8'));
stats.processCases=Object.keys(processCases).length;stats.processImages=0;stats.processBindings=0;
const processRoutes=new Set();
for(const [id,lesson]of Object.entries(processCases)){
  const hashes=[];
  if(lesson.steps.length<4||lesson.steps.length!==processManifest[id]?.length)errors.push('incomplete process case '+id);
  if(!lesson.transfer||!lesson.points.length)errors.push('missing process transfer task '+id);
  for(const [i,step]of lesson.steps.entries()){
    stats.processImages++;
    if(['title','action','observe','reason','tool','check'].some(k=>!step[k]))errors.push('missing image explanation '+id+'/'+i);
    const file=path.join(root,step.src.split('?')[0]);
    if(!fs.existsSync(file)){errors.push('missing process image '+step.src);continue;}
    const data=fs.readFileSync(file),manifest=processManifest[id][i];
    if(data.toString('hex',0,8)!=='89504e470d0a1a0a'||data.readUInt32BE(16)!==manifest.width||data.readUInt32BE(20)!==manifest.height||step.width!==manifest.width||step.height!==manifest.height)errors.push('invalid process PNG/dimensions '+step.src);
    hashes.push(crypto.createHash('sha256').update(data).digest('hex'));
  }
  if(new Set(hashes).size!==hashes.length)errors.push('duplicate process frames '+id);
  for(const route of lesson.routes){
    stats.processBindings++;
    if(processRoutes.has(route))errors.push('overloaded process chapter '+route);
    processRoutes.add(route);
    const [m,c]=route.split('/'),chapter=w.CONTENT[m]?.chapters.find(ch=>ch.id===c);
    if(!chapter||!chapter.content.includes('demo:process-'+id))errors.push('missing process chapter binding '+route);
  }
}
for(const [m,module]of Object.entries(w.CONTENT))for(const chapter of module.chapters){
  for(const match of chapter.content.matchAll(/```demo:process-([^\s]+)/g))if(!processCases[match[1]]?.routes.includes(m+'/'+chapter.id))errors.push('unapproved process binding '+m+'/'+chapter.id);
}
// Regression checks for factual contradictions found across prose, diagrams and quizzes.
// These cannot establish every claim's truth; they keep known misleading assertions from returning.
const obsolete=[
  ['assets/js/content/myths.js','足够支撑前两年'],
  ['assets/js/content/myths.js','2~3 年是现实区间'],
  ['assets/js/content/myths.js','天赋只决定**起点速度**'],
  ['assets/js/content/start.js','这是印刷的安全线'],
  ['assets/js/content/start.js','Live2D 单件：2048'],
  ['assets/js/content/fundamentals.js','鼻梁偏向近侧'],
  ['assets/js/content/fundamentals.js','眼线向上弯'],
  ['assets/js/content/cel.js','改底色时，阴影自动跟随'],
  ['assets/js/content/cel.js','- 高光不剪贴。'],
  ['assets/js/content/ipad.js','每一层 = 一帧'],
  ['assets/js/content/ipad.js','轻度/看剧，不适合专业绘画'],
  ['assets/js/content/sai2.js','没有云、没有 3D、没有矢量'],
  ['assets/js/content/csp.js','闭合缝隙（扩大/缩小）'],
  ['assets/js/content/live2d.js','PIE（Parts/Image/Effects）'],
  ['assets/js/content/career.js','常见 30%~50%。定金'],
  ['assets/js/demos3.js','1 本结构 + 1 本色彩 + 1 本画集足够'],
  ['assets/js/diagrams.js','三类就够'],
  ['assets/js/diagrams.js','配 5 次练习，才算读完'],
  ['assets/js/diagrams.js','同一根线放大 400% 仍然锐利'],
  ['assets/js/app.js','它们不是零基础书']
];
for(const [file,claim]of obsolete)if(fs.readFileSync(path.join(root,file),'utf8').includes(claim))errors.push('outdated assertion '+file+': '+claim);
for(const [module,chapter,required]of [
  ['myths','ch01','不必先买书'],
  ['start','ch06','指定/指派配置文件'],
  ['ipad','ch01','没有压力感应'],
  ['ipad','ch07','不能在Procreate中任意跨RGB与CMYK'],
  ['sai2','ch01','Linework'],
  ['csp','ch01','24帧指时间轴长度'],
  ['career','ch06','20%'],
  ['myths','ch12','网格辅助不必然等于描线']
])if(!w.CONTENT[module].chapters.find(ch=>ch.id===chapter).content.includes(required))errors.push('missing qualification '+module+'/'+chapter+': '+required);
stats.factRegressionChecks=obsolete.length+8;
const reverse=w.CONTENT.reverse;
if(!reverse||reverse.chapters.length!==14)errors.push('reverse module requires 14 chapters');
const reverseRequirements=[
  ['ch02','后期'],['ch03','组名'],['ch04','不能把修改时间直接当绘制时间'],
  ['ch05','不包含前后的 12 字节'],['ch06','有损 DCT'],
  ['ch07','任何水印都绝对不可逆'],['ch07','B=101'],
  ['ch08','误报'],['ch09','位图包装'],['ch10','单张合成图通常做不到'],
  ['ch11','可证伪'],['ch12','不保证声明中的所有现实事实都真实'],['ch13','不完整解析'],['ch14','替代解释']
];
for(const [id,phrase]of reverseRequirements)if(!reverse?.chapters.find(c=>c.id===id)?.content.includes(phrase))errors.push('missing reverse qualification '+id+': '+phrase);
for(const id of ['reverse-watermark','reverse-layers','reverse-svg','reverse-inspector','reverse-metadata'])if(!w.DEMOS[id])errors.push('missing reverse experiment '+id);
for(const file of ['assets/js/reverse-metadata-worker.js','assets/js/vendor/exifr-7.1.3.umd.js','assets/js/vendor/exifr-LICENSE.txt'])if(!fs.existsSync(path.join(root,file)))errors.push('missing metadata dependency '+file);
const metadataSource=['assets/js/vendor/exifr-7.1.3.umd.js','assets/js/reverse-metadata-core.js','assets/js/reverse-metadata-worker.js'].map(file=>fs.readFileSync(path.join(root,file),'utf8')).join('\n;\n');
if(w.REVERSE_METADATA_RUNTIME?.workerSource!==metadataSource||w.REVERSE_METADATA_RUNTIME?.sampleBase64!==fs.readFileSync(path.join(root,'assets/practice/reverse-sample.png')).toString('base64'))errors.push('metadata runtime bundle must be rebuilt');
if(!w.REVERSE_METADATA_IO)errors.push('missing metadata IO adapter');
if(!reverse.chapters[2].content.includes('demo:reverse-metadata')||!reverse.utility)errors.push('missing metadata tool entry');
if(!fs.existsSync(path.join(root,'assets/practice/reverse-sample.png')))errors.push('missing reverse PNG sample');
stats.factRegressionChecks+=reverseRequirements.length;
fs.writeFileSync(path.join(root,'tools/content-audit.json'),JSON.stringify({stats,errors,routes},null,2));
console.log(JSON.stringify({stats,errors},null,2));if(errors.length)process.exitCode=1;
