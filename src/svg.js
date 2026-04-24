const C={p:'#7f5af0',g:'#2cb67d',r:'#e53170',o:'#ff8906',c:'#06b6d4',w:'#1e293b',m:'#64748b',bg:'rgba(0,0,0,0.02)'};
const svgOpen=(w,h)=>`<svg viewBox="0 0 ${w} ${h}" width="100%" style="border-radius:14px;">`;
const rect=(x,y,w,h,fill,rx=12,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const txt=(x,y,text,fill=C.w,size=18,extra='')=>`<text x="${x}" y="${y}" text-anchor="middle" fill="${fill}" font-size="${size}" font-weight="700" font-family="Outfit" ${extra}>${text}</text>`;
const circ=(cx,cy,r,fill,extra='')=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`;
const anim=(attr,vals,dur,extra='')=>`<animate attributeName="${attr}" values="${vals}" dur="${dur}" ${extra}/>`;
const fadeIn=(delay=0)=>`opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.4s" fill="freeze" begin="${delay}s"/`;

export const SVG = {
  numberLine(min,max,highlights=[],showHop=false,hiddenValue=null){
    const w=620,h=210,pad=45,lineY=125,range=max-min,step=(w-pad*2)/range;
    let s=svgOpen(w,h);
    // gradient defs
    s+=`<defs><linearGradient id="nlg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${C.p}" stop-opacity="0.6"/><stop offset="100%" stop-color="${C.c}" stop-opacity="0.6"/></linearGradient></defs>`;
    // main line with gradient
    s+=`<line x1="${pad-15}" y1="${lineY}" x2="${w-pad+15}" y2="${lineY}" stroke="url(#nlg)" stroke-width="4" stroke-linecap="round"/>`;
    for(let i=min;i<=max;i++){
      const x=pad+(i-min)*step,hl=highlights.includes(i);
      s+=`<line x1="${x}" y1="${lineY-12}" x2="${x}" y2="${lineY+12}" stroke="${hl?C.o:'#4a4a6a'}" stroke-width="${hl?3:2}"/>`;
      if(i===hiddenValue){
        s+=`<text x="${x}" y="${lineY+38}" text-anchor="middle" font-size="26">🐸</text>`;
        s+=circ(x,lineY,10,'rgba(245,158,11,0.3)',`>${anim('r','10;16;10','1.2s','repeatCount="indefinite"')}</circle`);
      } else {
        const col=hl?C.o:C.w;
        const del=(i-min)*0.04;
        s+=`<text x="${x}" y="${lineY+36}" text-anchor="middle" fill="${col}" font-weight="${hl?'800':'500'}" font-size="${hl?20:16}" font-family="Outfit" ${fadeIn(del)}>${i}</text>`;
      }
      if(hl&&!showHop) s+=circ(x,lineY,7,C.o,`>${anim('r','7;11;7','1s','repeatCount="indefinite"')}</circle`);
    }
    if(showHop&&highlights.length>=2){
      const f=highlights[0],t=highlights[highlights.length-1];
      const fX=pad+(f-min)*step,tX=pad+(t-min)*step,mX=(fX+tX)/2;
      s+=`<defs><marker id="arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="${C.g}"/></marker></defs>`;
      s+=`<path d="M ${fX} ${lineY} Q ${mX} 30 ${tX} ${lineY}" fill="none" stroke="${C.g}" stroke-width="3.5" stroke-dasharray="10 5" marker-end="url(#arr)">${anim('stroke-dashoffset','80;0','2s','repeatCount="indefinite"')}</path>`;
      s+=`<text x="${tX}" y="${lineY-35}" text-anchor="middle" font-size="30">🐸</text>`;
      s+=`<text x="${mX}" y="22" text-anchor="middle" fill="${C.g}" font-size="14" font-weight="700" font-family="Outfit">${f} → ${t}</text>`;
    }
    return s+'</svg>';
  },

  additionOnLine(min,max,a,b,showTotal=true){
    const w=620,h=230,pad=45,lineY=150,range=max-min,step=(w-pad*2)/range;
    let s=svgOpen(w,h);
    s+=`<defs><marker id="ha" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${C.p}"/></marker>`;
    s+=`<linearGradient id="alg"><stop offset="0%" stop-color="${C.p}"/><stop offset="100%" stop-color="${C.c}"/></linearGradient></defs>`;
    s+=`<line x1="${pad-15}" y1="${lineY}" x2="${w-pad+15}" y2="${lineY}" stroke="url(#alg)" stroke-width="4" stroke-linecap="round"/>`;
    // equation at top
    s+=txt(w/2,28, showTotal ? `${a} + ${b} = ${a+b}` : `${a} + ${b} = ?`, C.w,22);
    for(let i=min;i<=max;i++){
      const x=pad+(i-min)*step,hl=(i===a||i===(a+b));
      s+=`<line x1="${x}" y1="${lineY-10}" x2="${x}" y2="${lineY+10}" stroke="#cbd5e1" stroke-width="2"/>`;
      if (!showTotal && i === (a+b)) {
        s+=txt(x,lineY+32,'?',hl?C.o:C.w,hl?18:15);
      } else {
        s+=txt(x,lineY+32,i,hl?C.o:C.w,hl?18:15);
      }
    }
    // hop arcs with running total
    for(let j=0;j<b;j++){
      const fX=pad+(a+j-min)*step,tX=pad+(a+j+1-min)*step,mX=(fX+tX)/2;
      const del=j*0.25;
      s+=`<path d="M ${fX} ${lineY} Q ${mX} ${lineY-50} ${tX} ${lineY}" fill="none" stroke="${C.p}" stroke-width="2.5" marker-end="url(#ha)" ${fadeIn(del)}/>`;
      s+=`<text x="${mX}" y="${lineY-55}" text-anchor="middle" fill="${C.r}" font-size="12" font-weight="800" font-family="Outfit" ${fadeIn(del+0.1)}>+1</text>`;
      // running total
      if(showTotal && j===b-1) s+=`<text x="${tX}" y="${lineY-70}" text-anchor="middle" fill="${C.g}" font-size="13" font-weight="700" font-family="Outfit" ${fadeIn(del+0.2)}>= ${a+b}</text>`;
    }
    s+=circ(pad+(a-min)*step,lineY,8,C.g);
    if(showTotal) {
      s+=circ(pad+(a+b-min)*step,lineY,8,C.r,`>${anim('r','8;12;8','1s','repeatCount="indefinite"')}</circle`);
      s+=txt(pad+(a+b-min)*step,lineY-18,`Land`,C.r,11);
    } else {
      s+=circ(pad+(a+b-min)*step,lineY,8,C.r);
      s+=txt(pad+(a+b-min)*step,lineY-18,`?`,C.r,14);
    }
    return s+'</svg>';
  },

  groups(countA,countB,emojiA='🍎',emojiB='🍊',showTotal=true){
    const w=520,h=220;
    let s=svgOpen(w,h);
    // Group A box
    s+=rect(20,25,195,130,`rgba(127,90,240,0.10)`,14,`stroke="${C.p}" stroke-width="2"`);
    s+=txt(117,20,`Group A`,C.p,13);
    for(let i=0;i<countA;i++){
      const col=i%5,row=Math.floor(i/5),del=i*0.07;
      s+=`<text x="${42+col*34}" y="${72+row*38}" font-size="28" ${fadeIn(del)}>${emojiA}</text>`;
      // count label
      s+=`<text x="${42+col*34+12}" y="${82+row*38+14}" text-anchor="middle" fill="${C.p}" font-size="10" font-weight="800" ${fadeIn(del+0.05)}>${i+1}</text>`;
    }
    s+=txt(240,108,'+',C.o,42);
    // Group B box
    s+=rect(285,25,195,130,`rgba(44,182,125,0.10)`,14,`stroke="${C.g}" stroke-width="2"`);
    s+=txt(382,20,`Group B`,C.g,13);
    for(let i=0;i<countB;i++){
      const col=i%5,row=Math.floor(i/5),del=(countA+i)*0.07;
      s+=`<text x="${307+col*34}" y="${72+row*38}" font-size="28" ${fadeIn(del)}>${emojiB}</text>`;
      s+=`<text x="${307+col*34+12}" y="${82+row*38+14}" text-anchor="middle" fill="${C.g}" font-size="10" font-weight="800" ${fadeIn(del+0.05)}>${countA+i+1}</text>`;
    }
    if(showTotal){
      const del=(countA+countB)*0.07+0.2;
      s+=`<text x="260" y="195" text-anchor="middle" fill="${C.w}" font-size="22" font-weight="800" font-family="Outfit" ${fadeIn(del)}>${countA} + ${countB} = ${countA+countB}</text>`;
    }
    return s+'</svg>';
  },

  dotArray(countA,countB,showTotal=true){
    const w=500,h=200,dotR=12,gap=32;
    let s=svgOpen(w,h);
    const total=countA+countB,startX=(w-(total*gap))/2+dotR;
    for(let i=0;i<total;i++){
      const x=startX+i*gap,y=90;
      const isA=i<countA,col=isA?C.p:C.g;
      const del=i*0.06;
      s+=`<circle cx="${x}" cy="${y}" r="${dotR}" fill="${col}" ${fadeIn(del)}/>`;
      s+=`<text x="${x}" y="${y+5}" text-anchor="middle" fill="#fff" font-size="11" font-weight="800" ${fadeIn(del+0.03)}>${i+1}</text>`;
    }
    // divider line
    if(countA>0&&countB>0){
      const dx=startX+countA*gap-gap/2;
      s+=`<line x1="${dx}" y1="60" x2="${dx}" y2="120" stroke="${C.o}" stroke-width="2" stroke-dasharray="4 3"/>`;
      s+=txt(startX+((countA-1)*gap)/2,55,countA,C.p,14);
      s+=txt(startX+countA*gap+((countB-1)*gap)/2,55,countB,C.g,14);
    }
    if(showTotal){
      s+=`<text x="250" y="160" text-anchor="middle" fill="${C.w}" font-size="20" font-weight="800" font-family="Outfit" ${fadeIn(total*0.06+0.2)}>${countA} + ${countB} = ${total}</text>`;
    }
    return s+'</svg>';
  },

  barModel(a,b,showTotal=true){
    const w=500,h=170,sum=a+b;
    const barW=400,barH=45,startX=50,topY=30,botY=95;
    let s=svgOpen(w,h);
    // whole bar on top
    s+=rect(startX,topY,barW,barH,`rgba(6,182,212,0.15)`,10,`stroke="${C.c}" stroke-width="2"`);
    s+=txt(startX+barW/2,topY+barH/2+6, showTotal ? sum : '?', C.c,22);
    // arrow down
    s+=`<line x1="250" y1="${topY+barH+5}" x2="250" y2="${botY-5}" stroke="${C.m}" stroke-width="2" stroke-dasharray="4 3"/>`;
    // part bars
    const wA=barW*(a/sum),wB=barW*(b/sum);
    s+=rect(startX,botY,wA,barH,`rgba(127,90,240,0.2)`,10,`stroke="${C.p}" stroke-width="2"`);
    s+=txt(startX+wA/2,botY+barH/2+6,a,C.p,20);
    s+=rect(startX+wA+4,botY,wB-4,barH,`rgba(44,182,125,0.2)`,10,`stroke="${C.g}" stroke-width="2"`);
    s+=txt(startX+wA+wB/2,botY+barH/2+6,b,C.g,20);
    s+=txt(250,botY+barH+25, showTotal ? `${a} + ${b} = ${sum}` : `${a} + ${b} = ?`, C.w,16);
    return s+'</svg>';
  },

  numberBond(a,b,showTotal=true){
    const w=300,h=220,sum=a+b;
    let s=svgOpen(w,h);
    // whole at top
    s+=`<line x1="150" y1="55" x2="80" y2="135" stroke="${C.m}" stroke-width="2"/>`;
    s+=`<line x1="150" y1="55" x2="220" y2="135" stroke="${C.m}" stroke-width="2"/>`;
    s+=circ(150,40,30,`rgba(6,182,212,0.2)`,`stroke="${C.c}" stroke-width="2"`);
    s+=txt(150,47, showTotal ? sum : '?', C.c,24);
    // parts
    s+=circ(80,150,28,`rgba(127,90,240,0.2)`,`stroke="${C.p}" stroke-width="2"`);
    s+=txt(80,157,a,C.p,22);
    s+=circ(220,150,28,`rgba(44,182,125,0.2)`,`stroke="${C.g}" stroke-width="2"`);
    s+=txt(220,157,b,C.g,22);
    s+=txt(150,210, showTotal ? `${a} + ${b} = ${sum}` : `${a} + ${b} = ?`, C.w,14);
    return s+'</svg>';
  },

  patternBridge(nums,rule){
    const w=560,h=190;
    let s=svgOpen(w,h);
    const n=nums.length;
    const gap=w/(n+1);
    const xP=nums.map((_,i)=>gap*(i+1));
    // Rule badge at top
    if(rule){
      const rw=rule.length*9+40;
      s+=`<rect x="${w/2-rw/2}" y="10" width="${rw}" height="28" rx="14" fill="rgba(6,182,212,0.15)" stroke="${C.c}" stroke-width="2"/>`;
      s+=txt(w/2,29,`Rule: ${rule}`,C.c,13);
    }
    // connecting arcs
    for(let i=0;i<n-1;i++){
      const mx=(xP[i]+xP[i+1])/2;
      s+=`<path d="M ${xP[i]+28} 85 Q ${mx} 45 ${xP[i+1]-28} 85" fill="none" stroke="rgba(6,182,212,0.6)" stroke-width="3" stroke-linecap="round"><animate attributeName="stroke-dashoffset" values="30;0" dur="1.5s" repeatCount="indefinite"/></path>`;
      // Always show rule on arc if we have one, or diff if not ?
      let label = '';
      if(rule) label = rule;
      else if(nums[i]!=='?'&&nums[i+1]!=='?') label = `+${nums[i+1]-nums[i]}`;
      if(label){
        s+=`<rect x="${mx-18}" y="32" width="36" height="20" rx="10" fill="var(--bg-main)"/>`;
        s+=txt(mx,46,label,C.c,12);
      }
    }
    nums.forEach((val,i)=>{
      const isQ=val==='?';
      const fill=isQ?'rgba(245,158,11,0.15)':'rgba(127,90,240,0.12)';
      const stroke=isQ?C.o:C.p;
      const del=i*0.12;
      s+=`<rect x="${xP[i]-28}" y="60" width="56" height="56" rx="16" fill="${fill}" stroke="${stroke}" stroke-width="3" ${fadeIn(del)}/>`;
      s+=`<text x="${xP[i]}" y="96" text-anchor="middle" fill="${isQ?C.o:C.w}" font-weight="800" font-size="22" font-family="Outfit" ${fadeIn(del+0.05)}>${val}</text>`;
      if(isQ){
        s+=`<rect x="${xP[i]-28}" y="60" width="56" height="56" rx="16" fill="none" stroke="${C.o}" stroke-width="3"><animate attributeName="stroke-opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/></rect>`;
      }
      // Position number below
      s+=`<text x="${xP[i]}" y="140" text-anchor="middle" fill="${C.m}" font-size="11" font-weight="600" font-family="Outfit" opacity="0.6">${i+1}${['st','nd','rd'][i]||'th'}</text>`;
    });
    return s+'</svg>';
  },

  tenFrame(filled,total=10){
    const w=320,h=180;
    let s=svgOpen(w,h);
    s+=rect(25,15,270,140,'none',12,`stroke="#cbd5e1" stroke-width="3"`);
    for(let r=0;r<2;r++){
      for(let c=0;c<5;c++){
        const x=40+c*50,y=28+r*65,idx=r*5+c;
        const isFilled=idx<filled;
        const del=idx*0.07;
        s+=`<rect x="${x}" y="${y}" width="40" height="40" rx="8" fill="${isFilled?C.p:'rgba(15,23,42,0.04)'}" stroke="${isFilled?'rgba(127,90,240,0.5)':'#cbd5e1'}" stroke-width="2" ${isFilled?fadeIn(del):''}/>`;
        if(isFilled) s+=`<text x="${x+20}" y="${y+27}" text-anchor="middle" fill="#fff" font-size="17" font-weight="800" font-family="Outfit" ${fadeIn(del+0.03)}>${idx+1}</text>`;
      }
    }
    return s+'</svg>';
  },

  tenFrameAddition(a,b,showTotal=true){
    const w=480,h=240,sum=a+b;
    let s=svgOpen(w,h);
    s+=`<rect x="140" y="5" width="200" height="28" rx="14" fill="rgba(6,182,212,0.1)" stroke="${C.c}" stroke-width="1.5"/>`;
    s+=txt(240,25, showTotal ? `${a} + ${b} = ${sum}` : `${a} + ${b} = ?`, C.w, 18, 'font-weight="800"');
    
    // frame
    s+=rect(40,45,270,140,'none',12,`stroke="#cbd5e1" stroke-width="3"`);
    for(let r=0;r<2;r++){
      for(let c=0;c<5;c++){
        const x=52+c*50,y=58+r*62,idx=r*5+c;
        const isA=idx<a,isB=idx>=a&&idx<Math.min(sum,10);
        const col=isA?C.p:isB?C.g:'rgba(15,23,42,0.04)';
        const border=isA?C.p:isB?C.g:'#cbd5e1';
        const del=idx*0.06;
        s+=`<rect x="${x}" y="${y}" width="42" height="42" rx="8" fill="${col}" fill-opacity="${isA||isB?'0.85':'1'}" stroke="${border}" stroke-width="2" ${(isA||isB)?fadeIn(del):''}/>`;
        if(isA||isB) s+=`<text x="${x+21}" y="${y+28}" text-anchor="middle" fill="#fff" font-size="15" font-weight="800" ${fadeIn(del+0.03)}>${idx+1}</text>`;
      }
    }

    if (sum >= 10) {
      s+=`<text x="175" y="210" text-anchor="middle" fill="${C.p}" font-size="14" font-weight="800" font-family="Outfit" ${fadeIn(0.7)}>✓ Makes 10</text>`;
    }

    // overflow dots
    if(sum>10){
      const overflow=sum-10;
      s+=`<rect x="335" y="45" width="100" height="140" rx="12" fill="rgba(245,158,11,0.08)" stroke="${C.o}" stroke-width="2" stroke-dasharray="6 4" ${fadeIn(0.8)}/>`;
      for(let i=0;i<overflow;i++){
        const cx = 365 + (i%2)*30;
        const cy = 75 + Math.floor(i/2)*40;
        const del=(10+i)*0.06;
        s+=circ(cx,cy,14,C.o,`${fadeIn(del)}/`);
        s+=`<text x="${cx}" y="${cy+5}" text-anchor="middle" fill="#fff" font-size="12" font-weight="800" ${fadeIn(del+0.03)}>${10+i+1}</text>`;
      }
      s+=`<text x="385" y="210" text-anchor="middle" fill="${C.o}" font-size="14" font-weight="800" font-family="Outfit" ${fadeIn(1.0)}>Leftover: ${overflow}</text>`;
      
      // Plus symbol between frame and leftover
      s+=txt(325, 125, '+', C.m, 24, fadeIn(0.8));
    }
    return s+'</svg>';
  },

  splitMerge(a,b,showTotal=true){
    const sum=a+b,need=10-a,left=b-need;
    const w=540,h=340;
    let s=svgOpen(w,h);
    // Defs
    s+=`<defs><linearGradient id="smg1"><stop offset="0%" stop-color="${C.p}"/><stop offset="100%" stop-color="#a78bfa"/></linearGradient>`;
    s+=`<linearGradient id="smg2"><stop offset="0%" stop-color="${C.r}"/><stop offset="100%" stop-color="#f472b6"/></linearGradient>`;
    s+=`<linearGradient id="smg3"><stop offset="0%" stop-color="${C.o}"/><stop offset="100%" stop-color="#fbbf24"/></linearGradient>`;
    s+=`<linearGradient id="smg4"><stop offset="0%" stop-color="${C.g}"/><stop offset="100%" stop-color="#34d399"/></linearGradient></defs>`;
    // Title
    s+=`<rect x="170" y="4" width="200" height="24" rx="12" fill="rgba(127,90,240,0.08)" stroke="${C.p}" stroke-width="1"/>`;
    s+=txt(270,20,'Split-and-Merge Method',C.p,11);
    // ── Row 1: original numbers ──
    s+=`<rect x="130" y="34" width="80" height="48" rx="14" fill="url(#smg1)" ${fadeIn(0.1)}/>`;
    s+=txt(170,66,a,'#fff',28,fadeIn(0.15));
    s+=txt(270,66,'+',C.o,30,fadeIn(0.2));
    s+=`<rect x="330" y="34" width="80" height="48" rx="14" fill="url(#smg4)" ${fadeIn(0.1)}/>`;
    s+=txt(370,66,b,'#fff',28,fadeIn(0.15));
    // ── Step 1 badge ──
    s+=`<rect x="305" y="92" width="130" height="20" rx="10" fill="rgba(229,49,112,0.1)" ${fadeIn(0.3)}/>`;
    s+=`<text x="370" y="106" text-anchor="middle" fill="${C.r}" font-size="10" font-weight="700" font-family="Outfit" ${fadeIn(0.35)}>Step 1: Split ${b}</text>`;
    // Split arrows from b-box
    s+=`<line x1="350" y1="86" x2="305" y2="130" stroke="${C.r}" stroke-width="2" stroke-dasharray="5 3" ${fadeIn(0.4)}/>`;
    s+=`<line x1="390" y1="86" x2="435" y2="130" stroke="${C.o}" stroke-width="2" stroke-dasharray="5 3" ${fadeIn(0.4)}/>`;
    // Split pieces
    s+=`<rect x="270" y="135" width="70" height="40" rx="10" fill="url(#smg2)" ${fadeIn(0.5)}/>`;
    s+=txt(305,162,need,'#fff',20,fadeIn(0.55));
    s+=`<rect x="400" y="135" width="70" height="40" rx="10" fill="url(#smg3)" ${fadeIn(0.5)}/>`;
    s+=txt(435,162,left,'#fff',20,fadeIn(0.55));
    // Labels under split
    s+=`<text x="305" y="190" text-anchor="middle" fill="${C.r}" font-size="9" font-family="Outfit" ${fadeIn(0.6)}>to make 10</text>`;
    s+=`<text x="435" y="190" text-anchor="middle" fill="${C.o}" font-size="9" font-family="Outfit" ${fadeIn(0.6)}>leftover</text>`;
    // ── Step 2 badge ──
    s+=`<rect x="60" y="115" width="130" height="20" rx="10" fill="rgba(127,90,240,0.1)" ${fadeIn(0.65)}/>`;
    s+=`<text x="125" y="129" text-anchor="middle" fill="${C.p}" font-size="10" font-weight="700" font-family="Outfit" ${fadeIn(0.7)}>Step 2: Make 10</text>`;
    // Merge arrows: a down + need piece across into 10-box
    s+=`<line x1="170" y1="86" x2="170" y2="210" stroke="${C.p}" stroke-width="2" stroke-dasharray="5 3" ${fadeIn(0.75)}/>`;
    s+=`<line x1="290" y1="178" x2="220" y2="218" stroke="${C.r}" stroke-width="2" stroke-dasharray="5 3" ${fadeIn(0.75)}/>`;
    // Equation label
    s+=`<text x="95" y="175" text-anchor="middle" fill="${C.p}" font-size="11" font-weight="700" font-family="Outfit" ${fadeIn(0.8)}>${a} + ${need} = 10</text>`;
    // Result: 10 box
    s+=`<rect x="120" y="215" width="110" height="50" rx="14" fill="url(#smg1)" ${fadeIn(0.9)}/>`;
    s+=txt(175,248,10,'#fff',28,fadeIn(0.95));
    // Plus sign
    s+=txt(280,248,'+',C.o,28,fadeIn(1.05));
    // Leftover box
    s+=`<rect x="320" y="215" width="80" height="50" rx="14" fill="url(#smg3)" ${fadeIn(1.1)}/>`;
    s+=txt(360,248,left,'#fff',28,fadeIn(1.15));
    // Arrow from leftover piece down
    s+=`<line x1="435" y1="178" x2="370" y2="213" stroke="${C.o}" stroke-width="2" stroke-dasharray="5 3" ${fadeIn(0.95)}/>`;
    // ── Step 3 badge ──
    s+=`<rect x="170" y="278" width="200" height="20" rx="10" fill="rgba(44,182,125,0.1)" ${fadeIn(1.2)}/>`;
    s+=`<text x="270" y="292" text-anchor="middle" fill="${C.g}" font-size="10" font-weight="700" font-family="Outfit" ${fadeIn(1.25)}>Step 3: Add the rest</text>`;
    // Final answer
    const ansText = showTotal ? `10 + ${left} = ${sum}` : `10 + ${left} = ?`;
    s+=`<rect x="170" y="305" width="200" height="30" rx="10" fill="rgba(44,182,125,0.08)" ${fadeIn(1.3)}/>`;
    s+=`<text x="270" y="326" text-anchor="middle" fill="${C.w}" font-size="20" font-weight="800" font-family="Outfit" ${fadeIn(1.35)}>${ansText}</text>`;
    return s+'</svg>';
  },

  bubbles(a,b,showSum=true){
    const w=580,h=260,sum=a+b;
    let s=svgOpen(w,h);
    s+=`<defs>
      <radialGradient id="bg1" cx="30%" cy="30%"><stop offset="0%" stop-color="#c4b5fd"/><stop offset="100%" stop-color="${C.p}"/></radialGradient>
      <radialGradient id="bg2" cx="30%" cy="30%"><stop offset="0%" stop-color="#86efac"/><stop offset="100%" stop-color="${C.g}"/></radialGradient>
      <radialGradient id="bg3" cx="30%" cy="30%"><stop offset="0%" stop-color="#fde68a"/><stop offset="100%" stop-color="${C.o}"/></radialGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
    const rA=Math.min(30+a*2.5,50),rB=Math.min(30+b*2.5,50);
    const cy=130;
    // positions: evenly spaced
    const bAx=95, bBx=245, eqx=345, bSx=470;
    // Bubble A with float animation
    s+=`<circle cx="${bAx}" cy="${cy}" r="${rA}" fill="url(#bg1)" opacity="0.92" filter="url(#glow)"><animate attributeName="cy" values="${cy};${cy-6};${cy}" dur="3s" repeatCount="indefinite"/></circle>`;
    s+=`<circle cx="${bAx}" cy="${cy}" r="${rA+8}" fill="none" stroke="rgba(127,90,240,0.18)" stroke-width="1.5"><animate attributeName="r" values="${rA+8};${rA+14};${rA+8}" dur="3s" repeatCount="indefinite"/></circle>`;
    s+=txt(bAx,cy+8,a,'#fff',26);
    // Plus label
    s+=txt(170,cy+8,'+',C.o,32);
    // Bubble B with float animation
    s+=`<circle cx="${bBx}" cy="${cy}" r="${rB}" fill="url(#bg2)" opacity="0.92" filter="url(#glow)"><animate attributeName="cy" values="${cy};${cy+6};${cy}" dur="2.8s" repeatCount="indefinite"/></circle>`;
    s+=`<circle cx="${bBx}" cy="${cy}" r="${rB+8}" fill="none" stroke="rgba(44,182,125,0.18)" stroke-width="1.5"><animate attributeName="r" values="${rB+8};${rB+14};${rB+8}" dur="2.8s" repeatCount="indefinite"/></circle>`;
    s+=txt(bBx,cy+8,b,'#fff',26);
    // Merge arrow
    s+=`<path d="${`M ${bAx+rA+10} ${cy} Q ${(bAx+bBx)/2} ${cy-35} ${bBx-rB-10} ${cy}`}" fill="none" stroke="rgba(255,137,6,0.25)" stroke-width="2" stroke-dasharray="6 4"><animate attributeName="stroke-dashoffset" values="20;0" dur="1.5s" repeatCount="indefinite"/></path>`;
    // Equals sign
    s+=txt(eqx,cy+8,'=',C.o,32);
    // Arrow from both bubbles to result
    s+=`<path d="M ${bBx+rB+10} ${cy} L ${bSx-60} ${cy}" fill="none" stroke="rgba(255,137,6,0.2)" stroke-width="2" stroke-dasharray="6 4"><animate attributeName="stroke-dashoffset" values="20;0" dur="1.5s" repeatCount="indefinite"/></path>`;
    if(showSum){
      const rS=Math.min(35+sum*1.5,58);
      s+=`<circle cx="${bSx}" cy="${cy}" r="${rS}" fill="url(#bg3)" opacity="0.92" filter="url(#glow)"><animate attributeName="r" values="${rS-2};${rS+3};${rS-2}" dur="2s" repeatCount="indefinite"/></circle>`;
      s+=`<circle cx="${bSx}" cy="${cy}" r="${rS+10}" fill="none" stroke="rgba(255,137,6,0.12)" stroke-width="1.5"><animate attributeName="r" values="${rS+10};${rS+16};${rS+10}" dur="2s" repeatCount="indefinite"/></circle>`;
      s+=txt(bSx,cy+9,sum,'#fff',28);
    } else {
      s+=`<circle cx="${bSx}" cy="${cy}" r="42" fill="rgba(200,200,200,0.06)" stroke="#cbd5e1" stroke-width="3" stroke-dasharray="8 4"><animate attributeName="r" values="40;44;40" dur="2s" repeatCount="indefinite"/></circle>`;
      s+=txt(bSx,cy+9,'?','#94a3b8',34);
    }
    // Label row
    s+=`<text x="${bAx}" y="${cy+rA+22}" text-anchor="middle" fill="${C.m}" font-size="10" font-family="Outfit" opacity="0.5">first</text>`;
    s+=`<text x="${bBx}" y="${cy+rB+22}" text-anchor="middle" fill="${C.m}" font-size="10" font-family="Outfit" opacity="0.5">second</text>`;
    if(showSum) s+=`<text x="${bSx}" y="${cy+60}" text-anchor="middle" fill="${C.m}" font-size="10" font-family="Outfit" opacity="0.5">merged</text>`;
    return s+'</svg>';
  },

  verticalAddition(a, b, showTotal=true) {
    const w = 400, h = 380;
    let s = svgOpen(w, h);
    const sum = a + b;
    const aOnes = a % 10, aTens = Math.floor(a / 10);
    const bOnes = b % 10, bTens = Math.floor(b / 10);
    const sumOnes = sum % 10, sumTens = Math.floor(sum / 10);
    const carry = (aOnes + bOnes >= 10) ? 1 : 0;
    const cx = 200; // center x
    const tensX = cx - 45, onesX = cx + 45;

    s+=`<defs>
      <linearGradient id="va-t" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(127,90,240,0.15)"/><stop offset="100%" stop-color="rgba(127,90,240,0.02)"/></linearGradient>
      <linearGradient id="va-o" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(44,182,125,0.15)"/><stop offset="100%" stop-color="rgba(44,182,125,0.02)"/></linearGradient>
    </defs>`;

    // Column backgrounds
    s += rect(tensX-38, 40, 76, 280, 'url(#va-t)', 16, `stroke="rgba(127,90,240,0.3)" stroke-width="1.5"`);
    s += rect(onesX-38, 40, 76, 280, 'url(#va-o)', 16, `stroke="rgba(44,182,125,0.3)" stroke-width="1.5"`);

    // Column Labels
    s += `<rect x="${tensX-18}" y="50" width="36" height="24" rx="12" fill="${C.p}" opacity="0.1"/>`;
    s += txt(tensX, 66, 'Tens', C.p, 12, 'font-weight="800"');
    s += `<rect x="${onesX-20}" y="50" width="40" height="24" rx="12" fill="${C.g}" opacity="0.1"/>`;
    s += txt(onesX, 66, 'Ones', C.g, 12, 'font-weight="800"');

    // Number A row (y=115)
    if (aTens > 0) s += txt(tensX, 125, aTens, C.p, 42, fadeIn(0.1));
    s += txt(onesX, 125, aOnes, C.g, 42, fadeIn(0.15));

    // Plus sign
    s += `<circle cx="${cx - 105}" cy="170" r="20" fill="rgba(255,137,6,0.15)" ${fadeIn(0.2)}/>`;
    s += txt(cx - 105, 182, '+', C.o, 36, fadeIn(0.25));

    // Number B row (y=175)
    if (bTens > 0) s += txt(tensX, 185, bTens, C.p, 42, fadeIn(0.35));
    s += txt(onesX, 185, bOnes, C.g, 42, fadeIn(0.4));

    // Divider line
    s += `<line x1="${cx-115}" y1="215" x2="${cx+95}" y2="215" stroke="${C.m}" stroke-width="4" stroke-linecap="round" ${fadeIn(0.6)}/>`;
    s += `<line x1="${cx-115}" y1="222" x2="${cx+95}" y2="222" stroke="${C.m}" stroke-width="1.5" stroke-linecap="round" opacity="0.4" ${fadeIn(0.6)}/>`;

    // Carry indicator
    if (carry) {
      s += `<circle cx="${tensX}" cy="80" r="16" fill="rgba(245,158,11,0.2)" stroke="${C.o}" stroke-width="2" ${fadeIn(0.9)}><animate attributeName="cy" values="80;76;80" dur="2s" repeatCount="indefinite"/></circle>`;
      s += txt(tensX, 86, '1', C.o, 18, fadeIn(0.95));
      // Carry arrow
      s += `<path d="M ${onesX} 200 Q ${cx} 230 ${tensX+16} 94" fill="none" stroke="${C.o}" stroke-width="2.5" stroke-dasharray="6 4" opacity="0"><animate attributeName="opacity" values="0;0.8;0" dur="2.5s" begin="1s" repeatCount="indefinite"/></path>`;
      // Carry label
      s += `<rect x="${cx+70}" y="200" width="60" height="20" rx="10" fill="rgba(245,158,11,0.15)" ${fadeIn(1.1)}/>`;
      s += `<text x="${cx+100}" y="214" text-anchor="middle" fill="${C.o}" font-size="11" font-weight="700" font-family="Outfit" ${fadeIn(1.15)}>carry 1</text>`;
    }

    // Result row (y=270)
    if (showTotal) {
      if (sumTens > 0) s += txt(tensX, 275, sumTens, C.p, 48, fadeIn(carry ? 1.4 : 1.0));
      s += txt(onesX, 275, sumOnes, C.g, 48, fadeIn(carry ? 1.5 : 1.1));
      // Result underline highlight
      s += `<rect x="${cx-70}" y="295" width="140" height="6" rx="3" fill="url(#alg2)" ${fadeIn(carry?1.6:1.2)}/>`;
      s += `<defs><linearGradient id="alg2"><stop offset="0%" stop-color="${C.p}"/><stop offset="100%" stop-color="${C.g}"/></linearGradient></defs>`;
      // Equation summary
      s += `<rect x="${cx-60}" y="320" width="120" height="30" rx="15" fill="rgba(15,23,42,0.04)" ${fadeIn(carry?1.7:1.3)}/>`;
      s += txt(cx, 341, `${a} + ${b} = ${sum}`, C.w, 18, fadeIn(carry?1.8:1.4));
    } else {
      s += txt(tensX, 275, '?', '#94a3b8', 48, fadeIn(0.9));
      s += txt(onesX, 275, '?', '#94a3b8', 48, fadeIn(1.0));
    }

    // Step annotations on right side
    s += `<text x="${cx+100}" y="125" text-anchor="start" fill="${C.m}" font-size="12" font-weight="600" font-family="Outfit" ${fadeIn(0.2)}>← ${a}</text>`;
    s += `<text x="${cx+100}" y="185" text-anchor="start" fill="${C.m}" font-size="12" font-weight="600" font-family="Outfit" ${fadeIn(0.4)}>← ${b}</text>`;

    return s + '</svg>';
  }
};
