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

  additionOnLine(min,max,a,b){
    const w=620,h=230,pad=45,lineY=150,range=max-min,step=(w-pad*2)/range;
    let s=svgOpen(w,h);
    s+=`<defs><marker id="ha" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${C.p}"/></marker>`;
    s+=`<linearGradient id="alg"><stop offset="0%" stop-color="${C.p}"/><stop offset="100%" stop-color="${C.c}"/></linearGradient></defs>`;
    s+=`<line x1="${pad-15}" y1="${lineY}" x2="${w-pad+15}" y2="${lineY}" stroke="url(#alg)" stroke-width="4" stroke-linecap="round"/>`;
    // equation at top
    s+=txt(w/2,28,`${a} + ${b} = ${a+b}`,C.w,22);
    for(let i=min;i<=max;i++){
      const x=pad+(i-min)*step,hl=(i===a||i===(a+b));
      s+=`<line x1="${x}" y1="${lineY-10}" x2="${x}" y2="${lineY+10}" stroke="#cbd5e1" stroke-width="2"/>`;
      s+=txt(x,lineY+32,i,hl?C.o:C.w,hl?18:15);
    }
    // hop arcs with running total
    for(let j=0;j<b;j++){
      const fX=pad+(a+j-min)*step,tX=pad+(a+j+1-min)*step,mX=(fX+tX)/2;
      const del=j*0.25;
      s+=`<path d="M ${fX} ${lineY} Q ${mX} ${lineY-50} ${tX} ${lineY}" fill="none" stroke="${C.p}" stroke-width="2.5" marker-end="url(#ha)" ${fadeIn(del)}/>`;
      s+=`<text x="${mX}" y="${lineY-55}" text-anchor="middle" fill="${C.r}" font-size="12" font-weight="800" font-family="Outfit" ${fadeIn(del+0.1)}>+1</text>`;
      // running total
      if(j===b-1) s+=`<text x="${tX}" y="${lineY-70}" text-anchor="middle" fill="${C.g}" font-size="13" font-weight="700" font-family="Outfit" ${fadeIn(del+0.2)}>= ${a+b}</text>`;
    }
    s+=circ(pad+(a-min)*step,lineY,8,C.g);
    s+=circ(pad+(a+b-min)*step,lineY,8,C.r,`>${anim('r','8;12;8','1s','repeatCount="indefinite"')}</circle`);
    s+=txt(pad+(a-min)*step,lineY-18,`Start`,C.g,11);
    s+=txt(pad+(a+b-min)*step,lineY-18,`Land`,C.r,11);
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

  barModel(a,b){
    const w=500,h=170,sum=a+b;
    const barW=400,barH=45,startX=50,topY=30,botY=95;
    let s=svgOpen(w,h);
    // whole bar on top
    s+=rect(startX,topY,barW,barH,`rgba(6,182,212,0.15)`,10,`stroke="${C.c}" stroke-width="2"`);
    s+=txt(startX+barW/2,topY+barH/2+6,sum,C.c,22);
    // arrow down
    s+=`<line x1="250" y1="${topY+barH+5}" x2="250" y2="${botY-5}" stroke="${C.m}" stroke-width="2" stroke-dasharray="4 3"/>`;
    // part bars
    const wA=barW*(a/sum),wB=barW*(b/sum);
    s+=rect(startX,botY,wA,barH,`rgba(127,90,240,0.2)`,10,`stroke="${C.p}" stroke-width="2"`);
    s+=txt(startX+wA/2,botY+barH/2+6,a,C.p,20);
    s+=rect(startX+wA+4,botY,wB-4,barH,`rgba(44,182,125,0.2)`,10,`stroke="${C.g}" stroke-width="2"`);
    s+=txt(startX+wA+wB/2,botY+barH/2+6,b,C.g,20);
    s+=txt(250,botY+barH+25,`${a} + ${b} = ${sum}`,C.w,16);
    return s+'</svg>';
  },

  numberBond(a,b){
    const w=300,h=220,sum=a+b;
    let s=svgOpen(w,h);
    // whole at top
    s+=`<line x1="150" y1="55" x2="80" y2="135" stroke="${C.m}" stroke-width="2"/>`;
    s+=`<line x1="150" y1="55" x2="220" y2="135" stroke="${C.m}" stroke-width="2"/>`;
    s+=circ(150,40,30,`rgba(6,182,212,0.2)`,`stroke="${C.c}" stroke-width="2"`);
    s+=txt(150,47,sum,C.c,24);
    // parts
    s+=circ(80,150,28,`rgba(127,90,240,0.2)`,`stroke="${C.p}" stroke-width="2"`);
    s+=txt(80,157,a,C.p,22);
    s+=circ(220,150,28,`rgba(44,182,125,0.2)`,`stroke="${C.g}" stroke-width="2"`);
    s+=txt(220,157,b,C.g,22);
    s+=txt(150,210,`${a} + ${b} = ${sum}`,C.w,14);
    return s+'</svg>';
  },

  patternBridge(nums,rule){
    const w=520,h=170;
    let s=svgOpen(w,h);
    const xP=[50,165,280,395,490];
    // connecting lines with animated dash
    for(let i=0;i<nums.length-1;i++){
      s+=`<line x1="${xP[i]+22}" y1="65" x2="${xP[i+1]-22}" y2="65" stroke="${C.c}" stroke-width="3" stroke-dasharray="8 4" stroke-linecap="round">${anim('stroke-dashoffset','20;0','1.5s','repeatCount="indefinite"')}</line>`;
      // difference arrow
      if(nums[i]!=='?'&&nums[i+1]!=='?'){
        const diff=nums[i+1]-nums[i];
        s+=txt((xP[i]+xP[i+1])/2,45,`+${diff}`,'#06b6d4',12);
      }
    }
    nums.forEach((n,i)=>{
      const isQ=n==='?';
      const fill=isQ?'rgba(245,158,11,0.2)':'rgba(127,90,240,0.15)';
      const stroke=isQ?C.o:C.p;
      const del=i*0.1;
      // hexagon-ish rounded rect
      s+=`<rect x="${xP[i]-24}" y="41" width="48" height="48" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="2.5" ${fadeIn(del)}/>`;
      s+=`<text x="${xP[i]}" y="72" text-anchor="middle" fill="${isQ?C.o:'#fff'}" font-weight="800" font-size="18" font-family="Outfit" ${fadeIn(del+0.05)}>${n}</text>`;
      if(isQ) s+=`<rect x="${xP[i]-24}" y="41" width="48" height="48" rx="14" fill="none" stroke="${C.o}" stroke-width="2">${anim('stroke-opacity','1;0.3;1','1.5s','repeatCount="indefinite"')}</rect>`;
    });
    if(rule) s+=txt(260,140,rule,C.m,15);
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

  tenFrameAddition(a,b){
    const w=420,h=220,sum=a+b;
    let s=svgOpen(w,h);
    s+=txt(210,22,`${a} + ${b} = ${sum}`,C.w,18);
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

  splitMerge(a,b){
    const sum=a+b,need=10-a,left=b-need;
    const w=500,h=290;
    let s=svgOpen(w,h);
    // Top row: a + b
    s+=rect(100,12,80,50,C.p,14);
    s+=txt(140,45,a,'#fff',24);
    s+=txt(250,45,'+',C.o,30);
    s+=rect(320,12,80,50,C.g,14);
    s+=txt(360,45,b,'#fff',24);
    // Split arrows
    s+=`<line x1="340" y1="68" x2="300" y2="112" stroke="${C.r}" stroke-width="2" stroke-dasharray="5 3" ${fadeIn(0.3)}/>`;
    s+=`<line x1="380" y1="68" x2="420" y2="112" stroke="${C.r}" stroke-width="2" stroke-dasharray="5 3" ${fadeIn(0.3)}/>`;
    s+=txt(360,82,'split!',C.r,11,fadeIn(0.35));
    // Split pieces
    s+=`<rect x="268" y="118" width="62" height="40" rx="10" fill="${C.r}" ${fadeIn(0.5)}/>`;
    s+=`<text x="299" y="145" text-anchor="middle" fill="#fff" font-size="18" font-weight="700" ${fadeIn(0.55)}>${need}</text>`;
    s+=`<rect x="390" y="118" width="62" height="40" rx="10" fill="${C.o}" ${fadeIn(0.5)}/>`;
    s+=`<text x="421" y="145" text-anchor="middle" fill="#fff" font-size="18" font-weight="700" ${fadeIn(0.55)}>${left}</text>`;
    // Merge arrows
    s+=`<line x1="140" y1="68" x2="170" y2="195" stroke="${C.p}" stroke-width="2" stroke-dasharray="5 3" ${fadeIn(0.7)}/>`;
    s+=`<line x1="299" y1="163" x2="210" y2="195" stroke="${C.r}" stroke-width="2" stroke-dasharray="5 3" ${fadeIn(0.7)}/>`;
    s+=txt(120,135,'make 10',C.p,11,fadeIn(0.75));
    // Result: 10
    s+=`<rect x="120" y="200" width="120" height="50" rx="14" fill="${C.p}" ${fadeIn(0.9)}/>`;
    s+=`<text x="180" y="232" text-anchor="middle" fill="#fff" font-size="24" font-weight="800" ${fadeIn(0.95)}>10</text>`;
    // Plus leftover
    s+=`<text x="285" y="232" text-anchor="middle" fill="${C.o}" font-size="26" font-weight="900" ${fadeIn(1.05)}>+</text>`;
    s+=`<rect x="330" y="200" width="80" height="50" rx="14" fill="${C.o}" ${fadeIn(1.1)}/>`;
    s+=`<text x="370" y="232" text-anchor="middle" fill="#fff" font-size="24" font-weight="800" ${fadeIn(1.15)}>${left}</text>`;
    // Final answer
    s+=`<text x="250" y="280" text-anchor="middle" fill="${C.w}" font-size="22" font-weight="800" font-family="Outfit" ${fadeIn(1.3)}>= ${sum}</text>`;
    return s+'</svg>';
  },

  bubbles(a,b,showSum=true){
    const w=520,h=230,sum=a+b;
    let s=svgOpen(w,h);
    s+=`<defs>
      <radialGradient id="bg1" cx="35%" cy="35%"><stop offset="0%" stop-color="#c4b5fd"/><stop offset="100%" stop-color="${C.p}"/></radialGradient>
      <radialGradient id="bg2" cx="35%" cy="35%"><stop offset="0%" stop-color="#86efac"/><stop offset="100%" stop-color="${C.g}"/></radialGradient>
      <radialGradient id="bg3" cx="35%" cy="35%"><stop offset="0%" stop-color="#fde68a"/><stop offset="100%" stop-color="${C.o}"/></radialGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
    const rA=32+a*2.5,rB=32+b*2.5;
    // Bubble A with inner particles
    s+=`<circle cx="120" cy="115" r="${rA}" fill="url(#bg1)" opacity="0.9" filter="url(#glow)">${anim('cy','115;108;115','3s','repeatCount="indefinite"')}</circle>`;
    for(let i=0;i<Math.min(a,6);i++){
      const px=110+Math.cos(i*1.1)*rA*0.5,py=108+Math.sin(i*1.1)*rA*0.5;
      s+=`<circle cx="${px}" cy="${py}" r="3" fill="rgba(255,255,255,0.4)">${anim('cy','${py};${py-6};${py}',`${1.5+i*0.3}s`,'repeatCount="indefinite"')}</circle>`;
    }
    s+=txt(120,122,a,'#fff',30);
    s+=txt(225,122,'+',C.o,38);
    // Bubble B
    s+=`<circle cx="330" cy="115" r="${rB}" fill="url(#bg2)" opacity="0.9" filter="url(#glow)">${anim('cy','115;120;115','2.8s','repeatCount="indefinite"')}</circle>`;
    for(let i=0;i<Math.min(b,6);i++){
      const px=320+Math.cos(i*1.2)*rB*0.5,py=110+Math.sin(i*1.2)*rB*0.5;
      s+=`<circle cx="${px}" cy="${py}" r="3" fill="rgba(255,255,255,0.4)">${anim('cy','${py};${py+5};${py}',`${1.8+i*0.3}s`,'repeatCount="indefinite"')}</circle>`;
    }
    s+=txt(330,122,b,'#fff',30);
    if(showSum){
      s+=txt(420,122,'=',C.o,38);
      const rS=Math.min(36+sum*1.8,58);
      s+=`<circle cx="480" cy="115" r="${rS}" fill="url(#bg3)" opacity="0.9" filter="url(#glow)">${anim('r',`${rS-4};${rS};${rS-4}`,'2s','repeatCount="indefinite"')}</circle>`;
      s+=txt(480,122,sum,'#fff',32);
    } else {
      s+=txt(420,122,'=',C.o,38);
      s+=`<circle cx="480" cy="115" r="36" fill="rgba(255,255,255,0.06)" stroke="#cbd5e1" stroke-width="3">${anim('r','34;38;34','2s','repeatCount="indefinite"')}</circle>`;
      s+=txt(480,122,'?','#64748b',38);
    }
    return s+'</svg>';
  },

  verticalAddition(a, b) {
    const w = 300, h = 320;
    let s = svgOpen(w, h);
    const sum = a + b;
    const aOnes = a % 10, aTens = Math.floor(a / 10);
    const bOnes = b % 10, bTens = Math.floor(b / 10);
    const sumOnes = sum % 10, sumTens = Math.floor(sum / 10);
    const carry = (aOnes + bOnes >= 10) ? 1 : 0;
    
    // Draw columns background
    s += rect(90, 40, 60, 240, 'rgba(127,90,240,0.08)', 8); // Tens column
    s += rect(150, 40, 60, 240, 'rgba(44,182,125,0.08)', 8); // Ones column
    
    // Column Labels
    s += txt(120, 65, 'Tens', C.p, 14);
    s += txt(180, 65, 'Ones', C.g, 14);
    
    // Plus sign
    s += txt(60, 160, '+', C.o, 32);
    
    // Number A
    if (aTens > 0) s += txt(120, 115, aTens, C.p, 32, fadeIn(0.2));
    s += txt(180, 115, aOnes, C.g, 32, fadeIn(0.3));
    
    // Number B
    if (bTens > 0) s += txt(120, 165, bTens, C.p, 32, fadeIn(0.5));
    s += txt(180, 165, bOnes, C.g, 32, fadeIn(0.6));
    
    // Line
    s += `<line x1="50" y1="190" x2="250" y2="190" stroke="${C.m}" stroke-width="4" stroke-linecap="round" ${fadeIn(0.8)}/>`;
    
    // Carry over logic
    if (carry) {
      s += circ(120, 85, 12, 'rgba(245,158,11,0.2)', fadeIn(1.2));
      s += txt(120, 90, '1', C.o, 14, fadeIn(1.25));
      
      // Animate carry arrow from ones to tens
      s += `<path d="M 180 205 Q 150 230 120 105" fill="none" stroke="${C.o}" stroke-width="2" stroke-dasharray="4 4" opacity="0"><animate attributeName="opacity" values="0;0.5;0" dur="2s" begin="1.4s" repeatCount="indefinite"/></path>`;
    }
    
    // Result
    if (sumTens > 0) s += txt(120, 235, sumTens, C.p, 36, fadeIn(carry ? 1.8 : 1.2));
    s += txt(180, 235, sumOnes, C.g, 36, fadeIn(carry ? 1.0 : 1.0));
    
    return s + '</svg>';
  }
};
