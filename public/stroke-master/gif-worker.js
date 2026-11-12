/* Runs with the exact embedded engine/planners and locally vendored codec. */
onmessage=async({data})=>{
 try{
  const engine=StrokeEngine(),doc=engine.validateDocument(data.document),plan=strokeGIFPlan(doc,data.options),gray=doc.medium==='charcoal';
  strokeGIFMemory(doc,plan,data.retained??0,engine.LIMITS.memoryBytes);
  const histogram=new Float64Array(32768*4),scale=(plan.width/doc.width+plan.height/doc.height)/2;
  const pause=()=>new Promise(resolve=>setTimeout(resolve,0));
  let timeline=engine.createTimeline(doc,plan.width,plan.height,0),completed=0;
  async function pixelsAt(position){const target=timeline.begin(position);while(!timeline.advance(target,24))await pause();
   if(doc.material.lighting!=='directional-1')return engine.rgba(timeline.surface,doc.material,'paint',scale);
   const out=new Uint8ClampedArray(plan.width*plan.height*4);for(let y=0;y<plan.height;y+=16){engine.shadeRows(timeline.surface,doc.material,scale,'final',y,y+16,out);await pause();}return out;
  }
  function progress(stage){postMessage({type:'progress',stage,progress:++completed/(plan.frames.length*plan.passes)});}
  if(!gray){const perFrame=Math.max(32,Math.floor(131072/plan.frames.length));for(const frame of plan.frames){const pixels=await pixelsAt(frame.position),n=pixels.length/4,step=Math.max(1,Math.floor(n/perFrame));for(let i=0;i<n;i+=step){const p=i*4,k=(((pixels[p]>>3)<<10)|((pixels[p+1]>>3)<<5)|(pixels[p+2]>>3))*4;histogram[k]++;for(let c=0;c<3;c++)histogram[k+c+1]+=pixels[p+c];}progress('Learning shared palette');}timeline.begin(0);}
  const palette=gray?Array.from({length:256},(_,i)=>[i,i,i]):strokeGIFPalette(histogram);
  const header=new StrokeGIFCodec.EncodeGif({width:plan.width,height:plan.height,colorTable:palette,backgroundColorIndex:255,looped:plan.loop,loopCount:0})._encodeHeader();
  const encoder=new StrokeGIFCodec.EncodeIndexdFrame(),writer=encoder.writable.getWriter(),reader=encoder.readable.getReader(),chunks=[header];let bytes=header.length+1;
  for(const frame of plan.frames){const pixels=await pixelsAt(frame.position),indexes=strokeGIFIndexes(pixels,plan.width,palette,gray);
   await writer.write({width:plan.width,height:plan.height,delay:frame.delay*10,disposal:1,data:indexes});const {value}=await reader.read();bytes+=value.length;if(bytes>96*1024*1024)throw Error('GIF exceeds 96 MiB. Reduce size, duration or frame rate.');chunks.push(value);progress('Encoding replay');await pause();
  }
  await writer.close();reader.releaseLock();writer.releaseLock();timeline=null;
  const output=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){output.set(chunk,offset);offset+=chunk.length;}output[offset]=0x3b;
  postMessage({type:'complete',buffer:output.buffer,plan},[output.buffer]);
 }catch(error){postMessage({type:'failure',message:error.message});}
};
