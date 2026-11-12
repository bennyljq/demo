/* Shared validation and deterministic accepted-stream sampling. No planner runs. */
function strokeGIFPlan(doc,options){
 const {edge,duration,fps,hold,loop}=options;
 if(!Number.isInteger(edge)||edge<64||edge>1536)throw Error('Long edge must be a whole number from 64 to 1536.');
 if(!Number.isFinite(duration)||duration<1||duration>60)throw Error('Drawing duration must be from 1 to 60 seconds.');
 if(!Number.isInteger(fps)||fps<2||fps>30)throw Error('Frame rate must be a whole number from 2 to 30.');
 if(!Number.isFinite(hold)||hold<.1||hold>30)throw Error('Final hold must be from 0.1 to 30 seconds.');
 if(typeof loop!=='boolean')throw Error('Choose whether the GIF should loop.');
 if(!doc||!Number.isInteger(doc.width)||!Number.isInteger(doc.height)||doc.width<1||doc.height<1||!Array.isArray(doc.strokes))throw Error('A recorded painting is required.');
 const scale=edge/Math.max(doc.width,doc.height),width=Math.max(1,Math.round(doc.width*scale)),height=Math.max(1,Math.round(doc.height*scale));
 const count=doc.strokes.length,intervals=Math.max(1,Math.round(duration*fps)),end=Math.round(duration*100),frames=[];
 for(let i=0;i<=intervals;i++){
  const position=i===intervals?count:Math.floor(count*i/intervals),delay=i===intervals?Math.round(hold*100):Math.round((i+1)*end/intervals)-Math.round(i*end/intervals);
  if(frames.at(-1)?.position===position)frames.at(-1).delay+=delay;else frames.push({position,delay});
 }
 const passes=doc.medium==='charcoal'?1:2,pixelWork=width*height*frames.length*passes;
 if(frames.length>481)throw Error('Choose a shorter duration or lower frame rate (maximum 481 distinct frames).');
 if(pixelWork>160000000)throw Error('Export is too large. Reduce size, duration or frame rate (160 million rendered pixels maximum).');
 return {width,height,frames,passes,pixelWork,totalSeconds:(end+Math.round(hold*100))/100,loop};
}
// The GIF worker replays records; it never creates reference-analysis/search
// buffers. Count the existing studio session once, then the export allocations.
// The output reserve covers compressed chunks plus the final contiguous buffer.
// Estimates include scratch/contact caches and document copies, not measured RSS.
function strokeGIFMemory(doc,plan,retainedBytes=0,limit=768*1024*1024){
 if(!Number.isFinite(retainedBytes)||retainedBytes<0)throw Error('Invalid retained GIF memory estimate.');
 const replayBytes=plan.width*plan.height*96,documentBytes=doc.strokes.length*1600*3,
  encoderBytes=192*1024*1024,overheadBytes=32*1024*1024,
  total=retainedBytes+replayBytes+documentBytes+encoderBytes+overheadBytes;
 if(!Number.isFinite(total)||total>limit)throw Error(`GIF export needs an estimated ${Math.ceil(total/1048576)} MiB including retained artwork (limit ${Math.floor(limit/1048576)} MiB). Reduce GIF size or export from an imported JSON copy in a separate studio tab.`);
 return {retainedBytes,replayBytes,documentBytes,encoderBytes,overheadBytes,total,limit};
}
// Deterministic weighted median-cut over a bounded RGB histogram. A shared
// palette prevents per-frame colour-table pumping. Quantisation is export only.
function strokeGIFPalette(histogram){
 const bins=[];for(let i=0;i<32768;i++)if(histogram[i*4])bins.push(i);
 const box=ids=>{const min=[255,255,255],max=[0,0,0];let weight=0;for(const i of ids){const n=histogram[i*4];weight+=n;for(let c=0;c<3;c++){const v=histogram[i*4+c+1]/n;min[c]=Math.min(min[c],v);max[c]=Math.max(max[c],v);}}const ranges=max.map((v,c)=>v-min[c]),axis=ranges.indexOf(Math.max(...ranges));return {ids,weight,axis,score:Math.max(...ranges)*weight};};
 const boxes=[box(bins)];while(boxes.length<256){let best=-1;for(let i=0;i<boxes.length;i++)if(boxes[i].ids.length>1&&(best<0||boxes[i].score>boxes[best].score))best=i;if(best<0)break;
  const b=boxes[best],c=b.axis;b.ids.sort((a,d)=>histogram[a*4+c+1]/histogram[a*4]-histogram[d*4+c+1]/histogram[d*4]||a-d);let sum=0,cut=1;for(;cut<b.ids.length-1;cut++){sum+=histogram[b.ids[cut-1]*4];if(sum>=b.weight/2)break;}boxes.splice(best,1,box(b.ids.slice(0,cut)),box(b.ids.slice(cut)));
 }
 const palette=boxes.map(b=>{const rgb=[0,0,0];for(const i of b.ids)for(let c=0;c<3;c++)rgb[c]+=histogram[i*4+c+1];return rgb.map(v=>Math.round(v/b.weight));});
 while(palette.length<256)palette.push(palette[0]??[249,249,249]);return palette;
}
function strokeGIFIndexes(pixels,width,palette,gray=false){
 const out=new Uint8ClampedArray(pixels.length/4),cache=new Map(),bayer=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
 for(let i=0;i<out.length;i++){
  const p=i*4;if(gray){out[i]=pixels[p];continue;}
  // Image-anchored ordered dither: no error propagates across frames/rows.
  const offset=(bayer[((Math.floor(i/width)&3)<<2)|(i%width&3)]-7.5)*.3;
  const r=Math.max(0,Math.min(255,Math.round(pixels[p]+offset))),g=Math.max(0,Math.min(255,Math.round(pixels[p+1]+offset))),b=Math.max(0,Math.min(255,Math.round(pixels[p+2]+offset))),key=(r<<16)|(g<<8)|b;
  let nearest=cache.get(key);if(nearest===undefined){let distance=Infinity;nearest=0;for(let j=0;j<palette.length;j++){const c=palette[j],d=(r-c[0])**2+(g-c[1])**2+(b-c[2])**2;if(d<distance){distance=d;nearest=j;}}if(cache.size<65536)cache.set(key,nearest);}out[i]=nearest;
 }return out;
}
if(typeof module!=='undefined')module.exports={strokeGIFPlan,strokeGIFMemory,strokeGIFPalette,strokeGIFIndexes};
