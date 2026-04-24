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
    const w=540,h=180;
    let s=svgOpen(w,h);
    const n=nums.length;
    const gap=w/(n+1);
    const xP=nums.map((_,i)=>gap*(i+1));
    // Rule badge at top
    if(rule){
      const rw=rule.length*9+30;
      s+=`<rect x="${w/2-rw/2}" y="4" width="${rw}" height="26" rx="13" fill="rgba(6,182,212,0.12)" stroke="${C.c}" stroke-width="1.5"/>`;
      s+=txt(w/2,22,`Rule: ${rule}`,C.c,12);
    }
    // connecting arcs
    for(let i=0;i<n-1;i++){
      const mx=(xP[i]+xP[i+1])/2;
      s+=`<path d="M ${xP[i]+24} 75 Q ${mx} 40 ${xP[i+1]-24} 75" fill="none" stroke="${C.c}" stroke-width="2.5" stroke-linecap="round">${anim('stroke-dashoffset','20;0','1.5s','repeatCount="indefinite"')}</path>`;
      if(nums[i]!=='?'&&nums[i+1]!=='?'){
        const diff=nums[i+1]-nums[i];
        s+=txt(mx,42,`+${diff}`,C.c,11);
      }
    }
    nums.forEach((val,i)=>{
      const isQ=val==='?';
      const fill=isQ?'rgba(245,158,11,0.15)':'rgba(127,90,240,0.12)';
      const stroke=isQ?C.o:C.p;
      const del=i*0.12;
      s+=`<rect x="${xP[i]-26}" y="52" width="52" height="52" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="2.5" ${fadeIn(del)}/>`;
      s+=`<text x="${xP[i]}" y="85" text-anchor="middle" fill="${isQ?C.o:C.w}" font-weight="800" font-size="20" font-family="Outfit" ${fadeIn(del+0.05)}>${val}</text>`;
      if(isQ){
        s+=`<rect x="${xP[i]-26}" y="52" width="52" height="52" rx="14" fill="none" stroke="${C.o}" stroke-width="2">${anim('stroke-opacity','1;0.3;1','1.5s','repeatCount="indefinite"')}</rect>`;
      }
      // Position number below
      s+=`<text x="${xP[i]}" y="125" text-anchor="middle" fill="${C.m}" font-size="10" font-family="Outfit" opacity="0.6">${i+1}${['st','nd','rd'][i]||'th'}</text>`;
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
    const w=420,h=220,sum=a+b;
    let s=svgOpen(w,h);
    s+=txt(210,22, showTotal ? `${a} + ${b} = ${sum}` : `${a} + ${b} = ?`, C.w,18);
    // frame
    s+=rect(40,35,270,140,'none',12,`stroke="#cbd5e1" stroke-width="3"`);
    for(let r=0;r<2;r++){
      for(let c=0;c<5;c++){
        const x=52+c*50,y=48+r*62,idx=r*5+c;
        const isA=idx<a,isB=idx>=a&&idx<Math.min(sum,10);
        const col=isA?C.p:isB?C.g:'rgba(15,23,42,0.04)';
        const border=isA?C.p:isB?C.g:'#cbd5e1';
        const del=idx*0.06;
        s+=`<rect x="${x}" y="${y}" width="42" height="42" rx="8" fill="${col}" fill-opacity="${isA||isB?'0.85':'1'}" stroke="${border}" stroke-width="2" ${(isA||isB)?fadeIn(del):''}/>`;
        if(isA||isB) s+=`<text x="${x+21}" y="${y+28}" text-anchor="middle" fill="#fff" font-size="15" font-weight="800" ${fadeIn(del+0.03)}>${idx+1}</text>`;
      }
    }
    // overflow dots
    if(sum>10){
      const overflow=sum-10;
      for(let i=0;i<overflow;i++){
        const x=340,y=60+i*35,del=(10+i)*0.06;
        s+=circ(x,y,16,C.o,`${fadeIn(del)}/`);
        s+=`<text x="${x}" y="${y+5}" text-anchor="middle" fill="#fff" font-size="13" font-weight="800" ${fadeIn(del+0.03)}>${10+i+1}</text>`;
      }
      s+=txt(370,sum>11?95:75,'↑',C.o,14);
      s+=txt(370,sum>11?115:95,`+${overflow}`,C.o,13);
    }
    return s+'</svg>';
  },

  splitMerge(a,b,showTotal=true){
    const sum=a+b,need=10-a,left=b-need;
    const w=520,h=300;
    let s=svgOpen(w,h);
    // Step label
    s+=txt(260,20,'Split-and-Merge Method',C.m,13);
    // Top row: a + b
    s+=rect(110,30,80,50,C.p,14);
    s+=txt(150,63,a,'#fff',26);
    s+=txt(260,63,'+',C.o,32);
    s+=rect(330,30,80,50,C.g,14);
    s+=txt(370,63,b,'#fff',26);
    // "Step 1: Split" label
    s+=`<text x="370" y="100" text-anchor="middle" fill="${C.r}" font-size="11" font-weight="700" font-family="Outfit" ${fadeIn(0.2)}>Step 1: Split ${b}</text>`;
    // Split arrows from b
    s+=`<line x1="350" y1="85" x2="310" y2="125" stroke="${C.r}" stroke-width="2" stroke-dasharray="5 3" ${fadeIn(0.3)}/>`;
    s+=`<line x1="390" y1="85" x2="430" y2="125" stroke="${C.r}" stroke-width="2" stroke-dasharray="5 3" ${fadeIn(0.3)}/>`;
    // Split pieces: need and left
    s+=`<rect x="278" y="130" width="65" height="42" rx="10" fill="${C.r}" ${fadeIn(0.5)}/>`;
    s+=`<text x="310" y="158" text-anchor="middle" fill="#fff" font-size="20" font-weight="700" ${fadeIn(0.55)}>${need}</text>`;
    s+=`<rect x="400" y="130" width="65" height="42" rx="10" fill="${C.o}" ${fadeIn(0.5)}/>`;
    s+=`<text x="432" y="158" text-anchor="middle" fill="#fff" font-size="20" font-weight="700" ${fadeIn(0.55)}>${left}</text>`;
    // "Step 2: Make 10" label
    s+=`<text x="150" y="110" text-anchor="middle" fill="${C.p}" font-size="11" font-weight="700" font-family="Outfit" ${fadeIn(0.6)}>Step 2: Make 10</text>`;
    // Merge arrows: a + need → 10
    s+=`<line x1="150" y1="85" x2="150" y2="195" stroke="${C.p}" stroke-width="2" stroke-dasharray="5 3" ${fadeIn(0.7)}/>`;
    s+=`<line x1="310" y1="175" x2="220" y2="210" stroke="${C.r}" stroke-width="2" stroke-dasharray="5 3" ${fadeIn(0.7)}/>`;
    // merge label
    s+=`<text x="100" y="155" text-anchor="middle" fill="${C.p}" font-size="10" font-weight="600" font-family="Outfit" ${fadeIn(0.75)}>${a}+${need}=10</text>`;
    // Result: 10
    s+=`<rect x="110" y="200" width="120" height="50" rx="14" fill="${C.p}" ${fadeIn(0.9)}/>`;
    s+=`<text x="170" y="233" text-anchor="middle" fill="#fff" font-size="26" font-weight="800" ${fadeIn(0.95)}>10</text>`;
    // Plus leftover
    s+=`<text x="280" y="233" text-anchor="middle" fill="${C.o}" font-size="28" font-weight="900" ${fadeIn(1.05)}>+</text>`;
    s+=`<rect x="330" y="200" width="80" height="50" rx="14" fill="${C.o}" ${fadeIn(1.1)}/>`;
    s+=`<text x="370" y="233" text-anchor="middle" fill="#fff" font-size="26" font-weight="800" ${fadeIn(1.15)}>${left}</text>`;
    // Arrow from leftover piece down
    s+=`<line x1="432" y1="175" x2="370" y2="198" stroke="${C.o}" stroke-width="2" stroke-dasharray="5 3" ${fadeIn(0.9)}/>`;
    // "Step 3" label
    s+=`<text x="260" y="270" text-anchor="middle" fill="${C.m}" font-size="11" font-weight="700" font-family="Outfit" ${fadeIn(1.2)}>Step 3: Add the rest</text>`;
    // Final answer
    s+=`<text x="260" y="295" text-anchor="middle" fill="${C.w}" font-size="22" font-weight="800" font-family="Outfit" ${fadeIn(1.3)}>10 + ${left} = ${showTotal ? sum : '?'}</text>`;
    return s+'</svg>';
  },

  bubbles(a,b,showSum=true){
    const w=560,h=250,sum=a+b;
    let s=svgOpen(w,h);
    s+=`<defs>
      <radialGradient id="bg1" cx="30%" cy="30%"><stop offset="0%" stop-color="#c4b5fd"/><stop offset="100%" stop-color="${C.p}"/></radialGradient>
      <radialGradient id="bg2" cx="30%" cy="30%"><stop offset="0%" stop-color="#86efac"/><stop offset="100%" stop-color="${C.g}"/></radialGradient>
      <radialGradient id="bg3" cx="30%" cy="30%"><stop offset="0%" stop-color="#fde68a"/><stop offset="100%" stop-color="${C.o}"/></radialGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
    const rA=Math.min(34+a*2,52),rB=Math.min(34+b*2,52);
    const cy=125;
    // Bubble A
    s+=`<circle cx="100" cy="${cy}" r="${rA}" fill="url(#bg1)" opacity="0.9" filter="url(#glow)">${anim('cy',`${cy};${cy-7};${cy}`,'3s','repeatCount="indefinite"')}</circle>`;
    s+=`<circle cx="100" cy="${cy}" r="${rA+6}" fill="none" stroke="rgba(127,90,240,0.2)" stroke-width="1.5">${anim('r',`${rA+6};${rA+12};${rA+6}`,'3s','repeatCount="indefinite"')}</circle>`;
    s+=txt(100,cy+8,a,'#fff',28);
    // Plus
    s+=txt(185,cy+8,'+',C.o,36);
    // Bubble B
    s+=`<circle cx="270" cy="${cy}" r="${rB}" fill="url(#bg2)" opacity="0.9" filter="url(#glow)">${anim('cy',`${cy};${cy+7};${cy}`,'2.8s','repeatCount="indefinite"')}</circle>`;
    s+=`<circle cx="270" cy="${cy}" r="${rB+6}" fill="none" stroke="rgba(44,182,125,0.2)" stroke-width="1.5">${anim('r',`${rB+6};${rB+12};${rB+6}`,'2.8s','repeatCount="indefinite"')}</circle>`;
    s+=txt(270,cy+8,b,'#fff',28);
    // Equals
    s+=txt(355,cy+8,'=',C.o,36);
    // Merge arrow
    s+=`<path d="M ${100+rA+8} ${cy} Q 185 ${cy-30} ${270-rB-8} ${cy}" fill="none" stroke="rgba(255,137,6,0.3)" stroke-width="2" stroke-dasharray="6 4">${anim('stroke-dashoffset','20;0','1.5s','repeatCount="indefinite"')}</path>`;
    if(showSum){
      const rS=Math.min(38+sum*1.5,60);
      s+=`<circle cx="450" cy="${cy}" r="${rS}" fill="url(#bg3)" opacity="0.9" filter="url(#glow)">${anim('r',`${rS-3};${rS+3};${rS-3}`,'2s','repeatCount="indefinite"')}</circle>`;
      s+=`<circle cx="450" cy="${cy}" r="${rS+8}" fill="none" stroke="rgba(255,137,6,0.15)" stroke-width="1.5">${anim('r',`${rS+8};${rS+14};${rS+8}`,'2s','repeatCount="indefinite"')}</circle>`;
      s+=txt(450,cy+8,sum,'#fff',30);
    } else {
      s+=`<circle cx="450" cy="${cy}" r="40" fill="rgba(200,200,200,0.08)" stroke="#cbd5e1" stroke-width="3" stroke-dasharray="8 4">${anim('r','38;42;38','2s','repeatCount="indefinite"')}</circle>`;
      s+=txt(450,cy+8,'?','#94a3b8',36);
    }
    return s+'</svg>';
  },

  verticalAddition(a, b, showTotal=true) {
    const w = 360, h = 340;
    let s = svgOpen(w, h);
    const sum = a + b;
    const aStr = String(a), bStr = String(b), sStr = String(sum);
    const maxLen = Math.max(aStr.length, bStr.length, sStr.length);
    const aOnes = a % 10, aTens = Math.floor(a / 10);
    const bOnes = b % 10, bTens = Math.floor(b / 10);
    const sumOnes = sum % 10, sumTens = Math.floor(sum / 10);
    const carry = (aOnes + bOnes >= 10) ? 1 : 0;
    const cx = 180; // center x
    const tensX = cx - 40, onesX = cx + 40;

    // Column backgrounds
    s += rect(tensX-32, 38, 64, 260, 'rgba(127,90,240,0.06)', 10, `stroke="rgba(127,90,240,0.15)" stroke-width="1"`);
    s += rect(onesX-32, 38, 64, 260, 'rgba(44,182,125,0.06)', 10, `stroke="rgba(44,182,125,0.15)" stroke-width="1"`);

    // Column Labels
    s += txt(tensX, 58, 'T', C.p, 13, 'font-style="italic"');
    s += txt(onesX, 58, 'O', C.g, 13, 'font-style="italic"');

    // Number A row (y=100)
    if (aTens > 0) s += txt(tensX, 105, aTens, C.p, 34, fadeIn(0.1));
    s += txt(onesX, 105, aOnes, C.g, 34, fadeIn(0.15));

    // Plus sign
    s += txt(cx - 80, 155, '+', C.o, 34, fadeIn(0.3));

    // Number B row (y=150)
    if (bTens > 0) s += txt(tensX, 155, bTens, C.p, 34, fadeIn(0.35));
    s += txt(onesX, 155, bOnes, C.g, 34, fadeIn(0.4));

    // Divider line
    s += `<line x1="${cx-90}" y1="180" x2="${cx+90}" y2="180" stroke="${C.m}" stroke-width="3.5" stroke-linecap="round" ${fadeIn(0.6)}/>`;
    s += `<line x1="${cx-90}" y1="184" x2="${cx+90}" y2="184" stroke="${C.m}" stroke-width="1.5" stroke-linecap="round" opacity="0.3" ${fadeIn(0.6)}/>`;

    // Carry indicator
    if (carry) {
      s += `<circle cx="${tensX}" cy="73" r="14" fill="rgba(245,158,11,0.15)" stroke="${C.o}" stroke-width="2" ${fadeIn(0.9)}/>`;
      s += txt(tensX, 78, '1', C.o, 15, fadeIn(0.95));
      // Carry arrow
      s += `<path d="M ${onesX} 170 Q ${cx} 200 ${tensX+14} 86" fill="none" stroke="${C.o}" stroke-width="2" stroke-dasharray="5 3" opacity="0"><animate attributeName="opacity" values="0;0.6;0" dur="2.5s" begin="1s" repeatCount="indefinite"/></path>`;
      // Carry label
      s += `<text x="${cx+60}" y="200" text-anchor="start" fill="${C.o}" font-size="11" font-weight="700" font-family="Outfit" ${fadeIn(1.1)}>carry 1</text>`;
    }

    // Result row (y=230)
    if (showTotal) {
      if (sumTens > 0) s += txt(tensX, 230, sumTens, C.p, 38, fadeIn(carry ? 1.4 : 1.0));
      s += txt(onesX, 230, sumOnes, C.g, 38, fadeIn(carry ? 1.5 : 1.1));
      // Result underline
      s += `<rect x="${cx-60}" y="240" width="120" height="4" rx="2" fill="url(#alg2)" ${fadeIn(carry?1.6:1.2)}/>`;
      s += `<defs><linearGradient id="alg2"><stop offset="0%" stop-color="${C.p}"/><stop offset="100%" stop-color="${C.g}"/></linearGradient></defs>`;
      // Equation summary
      s += txt(cx, 280, `${a} + ${b} = ${sum}`, C.w, 16, fadeIn(carry?1.8:1.4));
    } else {
      s += txt(tensX, 230, '?', '#94a3b8', 38, fadeIn(0.9));
      s += txt(onesX, 230, '?', '#94a3b8', 38, fadeIn(1.0));
    }

    // Step annotations on right side
    s += `<text x="${cx+95}" y="105" text-anchor="start" fill="${C.m}" font-size="10" font-family="Outfit" ${fadeIn(0.2)}>← ${a}</text>`;
    s += `<text x="${cx+95}" y="155" text-anchor="start" fill="${C.m}" font-size="10" font-family="Outfit" ${fadeIn(0.4)}>← ${b}</text>`;

    return s + '</svg>';
  }
};
