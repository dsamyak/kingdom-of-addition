export const SVG = {
  numberLine(min, max, highlights=[], showHop=false, hiddenValue=null) {
    const w=600,h=200,pad=40,lineY=120,range=max-min,step=(w-pad*2)/range;
    let s=`<svg viewBox="0 0 ${w} ${h}" width="100%" height="250" style="background:rgba(0,0,0,0.02);border-radius:12px;">`;
    s+=`<line x1="${pad-20}" y1="${lineY}" x2="${w-pad+20}" y2="${lineY}" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>`;
    for(let i=min;i<=max;i++){
      const x=pad+(i-min)*step, hl=highlights.includes(i), col=hl?'#d97706':'#fffffe';
      s+=`<line x1="${x}" y1="${lineY-10}" x2="${x}" y2="${lineY+10}" stroke="#64748b" stroke-width="${hl?4:2}"/>`;
      if(i===hiddenValue) s+=`<text x="${x}" y="${lineY+35}" text-anchor="middle" font-size="24">🐸</text>`;
      else s+=`<text x="${x}" y="${lineY+35}" text-anchor="middle" fill="${col}" font-weight="${hl?'bold':'normal'}" font-size="18" font-family="Outfit">${i}</text>`;
      if(hl&&!showHop) s+=`<circle cx="${x}" cy="${lineY}" r="8" fill="#f59e0b"><animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite"/></circle>`;
    }
    if(showHop&&highlights.length>=2){
      const from=highlights[0],to=highlights[highlights.length-1];
      const fX=pad+(from-min)*step,tX=pad+(to-min)*step,mX=(fX+tX)/2;
      s+=`<defs><marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#10b981"/></marker></defs>`;
      s+=`<path d="M ${fX} ${lineY} Q ${mX} 40 ${tX} ${lineY}" fill="none" stroke="#10b981" stroke-width="4" stroke-dasharray="10 5" marker-end="url(#arr)"><animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite"/></path>`;
      s+=`<text x="${tX}" y="${lineY-30}" text-anchor="middle" font-size="28">🐸</text>`;
    }
    return s+`</svg>`;
  },

  additionOnLine(min, max, a, b) {
    const w=600,h=220,pad=40,lineY=140,range=max-min,step=(w-pad*2)/range;
    let s=`<svg viewBox="0 0 ${w} ${h}" width="100%" height="260" style="background:rgba(0,0,0,0.02);border-radius:12px;">`;
    s+=`<defs><marker id="ha" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#7f5af0"/></marker></defs>`;
    s+=`<line x1="${pad-20}" y1="${lineY}" x2="${w-pad+20}" y2="${lineY}" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>`;
    for(let i=min;i<=max;i++){
      const x=pad+(i-min)*step;
      const hl=i===a||i===(a+b);
      s+=`<line x1="${x}" y1="${lineY-10}" x2="${x}" y2="${lineY+10}" stroke="#64748b" stroke-width="2"/>`;
      s+=`<text x="${x}" y="${lineY+30}" text-anchor="middle" fill="${hl?'#ff8906':'#fffffe'}" font-weight="${hl?'bold':'normal'}" font-size="16" font-family="Outfit">${i}</text>`;
    }
    // Draw individual hops
    for(let j=0;j<b;j++){
      const fromX=pad+(a+j-min)*step, toX=pad+(a+j+1-min)*step, midX=(fromX+toX)/2;
      s+=`<path d="M ${fromX} ${lineY} Q ${midX} ${lineY-45} ${toX} ${lineY}" fill="none" stroke="#7f5af0" stroke-width="3" marker-end="url(#ha)"><animate attributeName="opacity" from="0" to="1" dur="0.4s" fill="freeze" begin="${j*0.3}s"/></path>`;
      s+=`<text x="${midX}" y="${lineY-50}" text-anchor="middle" fill="#e53170" font-size="13" font-weight="bold" font-family="Outfit"><animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin="${j*0.3+0.1}s"/>+1</text>`;
    }
    s+=`<circle cx="${pad+(a-min)*step}" cy="${lineY}" r="8" fill="#2cb67d"/>`;
    s+=`<circle cx="${pad+(a+b-min)*step}" cy="${lineY}" r="8" fill="#e53170"><animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite"/></circle>`;
    s+=`<text x="${pad+(a-min)*step}" y="${lineY-20}" text-anchor="middle" font-size="13" fill="#2cb67d" font-weight="bold">Start: ${a}</text>`;
    s+=`<text x="${pad+(a+b-min)*step}" y="${lineY-20}" text-anchor="middle" font-size="13" fill="#e53170" font-weight="bold">Land: ${a+b}</text>`;
    s+=`<text x="${w/2}" y="25" text-anchor="middle" fill="#fffffe" font-size="20" font-weight="800" font-family="Outfit">${a} + ${b} = ${a+b}</text>`;
    return s+`</svg>`;
  },

  groups(countA, countB, emojiA='🍎', emojiB='🍊', showTotal=true) {
    const w=500,h=200;
    let s=`<svg viewBox="0 0 ${w} ${h}" width="100%" height="220" style="background:rgba(0,0,0,0.02);border-radius:12px;">`;
    // Group A
    s+=`<rect x="20" y="30" width="180" height="120" rx="14" fill="rgba(127,90,240,0.12)" stroke="#7f5af0" stroke-width="2"/>`;
    for(let i=0;i<countA;i++){
      const col=i%5, row=Math.floor(i/5);
      s+=`<text x="${40+col*32}" y="${75+row*35}" font-size="26"><animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin="${i*0.08}s"/>${emojiA}</text>`;
    }
    // Plus sign
    s+=`<text x="230" y="105" text-anchor="middle" fill="#ff8906" font-size="40" font-weight="900" font-family="Outfit">+</text>`;
    // Group B
    s+=`<rect x="270" y="30" width="180" height="120" rx="14" fill="rgba(44,182,125,0.12)" stroke="#2cb67d" stroke-width="2"/>`;
    for(let i=0;i<countB;i++){
      const col=i%5, row=Math.floor(i/5);
      s+=`<text x="${290+col*32}" y="${75+row*35}" font-size="26"><animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin="${(countA+i)*0.08}s"/>${emojiB}</text>`;
    }
    if(showTotal){
      s+=`<text x="250" y="185" text-anchor="middle" fill="#fffffe" font-size="22" font-weight="800" font-family="Outfit">${countA} + ${countB} = ${countA+countB}</text>`;
    }
    return s+`</svg>`;
  },

  patternBridge(nums, rule) {
    let s=`<svg viewBox="0 0 500 150" width="100%" height="200" style="background:rgba(0,0,0,0.02)">`;
    s+=`<path d="M50 70 Q 150 20 250 70 T 450 70" fill="none" stroke="#06b6d4" stroke-width="4" stroke-dasharray="8 4"/>`;
    const xP=[50,150,250,350,450], yP=[70,45,70,45,70];
    nums.forEach((n,i)=>{
      const col=n==='?'?'#f59e0b':'#7c3aed';
      s+=`<circle cx="${xP[i]}" cy="${yP[i]}" r="20" fill="${col}"/>`;
      s+=`<text x="${xP[i]}" y="${yP[i]+5}" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">${n}</text>`;
    });
    if(rule) s+=`<text x="250" y="130" text-anchor="middle" fill="#a7a9be" font-size="16">${rule}</text>`;
    return s+`</svg>`;
  },

  tenFrame(filled, total=10) {
    const w=300,h=160;
    let s=`<svg viewBox="0 0 ${w} ${h}" width="100%" height="180" style="background:rgba(0,0,0,0.02);border-radius:12px;">`;
    s+=`<rect x="30" y="20" width="240" height="120" rx="10" fill="none" stroke="#64748b" stroke-width="3"/>`;
    for(let r=0;r<2;r++){
      for(let c=0;c<5;c++){
        const x=45+c*46,y=35+r*55,idx=r*5+c;
        s+=`<rect x="${x}" y="${y}" width="36" height="36" rx="6" fill="${idx<filled?'#7f5af0':'rgba(255,255,255,0.05)'}" stroke="#64748b" stroke-width="1.5">`;
        if(idx<filled) s+=`<animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin="${idx*0.06}s"/>`;
        s+=`</rect>`;
        if(idx<filled) s+=`<text x="${x+18}" y="${y+25}" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">${idx+1}</text>`;
      }
    }
    return s+`</svg>`;
  },

  splitMerge(a, b) {
    const sum=a+b, make10a=10-a, leftover=b-make10a;
    const w=500,h=280;
    let s=`<svg viewBox="0 0 ${w} ${h}" width="100%" height="300" style="background:rgba(0,0,0,0.02);border-radius:12px;">`;
    // Top: original numbers
    s+=`<rect x="100" y="15" width="80" height="50" rx="12" fill="#7f5af0"/><text x="140" y="48" text-anchor="middle" fill="#fff" font-size="24" font-weight="800">${a}</text>`;
    s+=`<text x="250" y="48" text-anchor="middle" fill="#ff8906" font-size="28" font-weight="900">+</text>`;
    s+=`<rect x="320" y="15" width="80" height="50" rx="12" fill="#2cb67d"/><text x="360" y="48" text-anchor="middle" fill="#fff" font-size="24" font-weight="800">${b}</text>`;
    // Split arrow from b
    s+=`<line x1="340" y1="70" x2="300" y2="115" stroke="#e53170" stroke-width="2" stroke-dasharray="4 3"><animate attributeName="opacity" from="0" to="1" dur="0.5s" fill="freeze" begin="0.3s"/></line>`;
    s+=`<line x1="380" y1="70" x2="420" y2="115" stroke="#e53170" stroke-width="2" stroke-dasharray="4 3"><animate attributeName="opacity" from="0" to="1" dur="0.5s" fill="freeze" begin="0.3s"/></line>`;
    // Split pieces
    s+=`<rect x="265" y="120" width="65" height="40" rx="10" fill="#e53170"><animate attributeName="opacity" from="0" to="1" dur="0.4s" fill="freeze" begin="0.5s"/></rect>`;
    s+=`<text x="297" y="147" text-anchor="middle" fill="#fff" font-size="18" font-weight="700"><animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin="0.6s"/>${make10a}</text>`;
    s+=`<rect x="390" y="120" width="65" height="40" rx="10" fill="#ff8906"><animate attributeName="opacity" from="0" to="1" dur="0.4s" fill="freeze" begin="0.5s"/></rect>`;
    s+=`<text x="422" y="147" text-anchor="middle" fill="#fff" font-size="18" font-weight="700"><animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin="0.6s"/>${leftover}</text>`;
    // Merge arrow: a + make10a -> 10
    s+=`<line x1="140" y1="70" x2="140" y2="195" stroke="#7f5af0" stroke-width="2" stroke-dasharray="4 3"><animate attributeName="opacity" from="0" to="1" dur="0.4s" fill="freeze" begin="0.8s"/></line>`;
    s+=`<line x1="297" y1="165" x2="200" y2="195" stroke="#e53170" stroke-width="2" stroke-dasharray="4 3"><animate attributeName="opacity" from="0" to="1" dur="0.4s" fill="freeze" begin="0.8s"/></line>`;
    // Result: 10
    s+=`<rect x="110" y="200" width="120" height="50" rx="12" fill="#7f5af0"><animate attributeName="opacity" from="0" to="1" dur="0.4s" fill="freeze" begin="1s"/></rect>`;
    s+=`<text x="170" y="232" text-anchor="middle" fill="#fff" font-size="22" font-weight="800"><animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin="1.1s"/>10</text>`;
    // Plus leftover
    s+=`<text x="280" y="232" text-anchor="middle" fill="#ff8906" font-size="24" font-weight="900"><animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin="1.2s"/>+</text>`;
    s+=`<rect x="330" y="200" width="80" height="50" rx="12" fill="#ff8906"><animate attributeName="opacity" from="0" to="1" dur="0.4s" fill="freeze" begin="1.2s"/></rect>`;
    s+=`<text x="370" y="232" text-anchor="middle" fill="#fff" font-size="22" font-weight="800"><animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin="1.3s"/>${leftover}</text>`;
    // Final = sum
    s+=`<text x="250" y="275" text-anchor="middle" fill="#fffffe" font-size="22" font-weight="800" font-family="Outfit"><animate attributeName="opacity" from="0" to="1" dur="0.4s" fill="freeze" begin="1.5s"/>= ${sum}</text>`;
    return s+`</svg>`;
  },

  bubbles(a, b, showSum=true) {
    const w=500,h=220,sum=a+b;
    let s=`<svg viewBox="0 0 ${w} ${h}" width="100%" height="240" style="background:rgba(0,0,0,0.02);border-radius:12px;">`;
    s+=`<defs><radialGradient id="bg1" cx="30%" cy="30%"><stop offset="0%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#7f5af0"/></radialGradient>`;
    s+=`<radialGradient id="bg2" cx="30%" cy="30%"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="100%" stop-color="#2cb67d"/></radialGradient>`;
    s+=`<radialGradient id="bg3" cx="30%" cy="30%"><stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#ff8906"/></radialGradient></defs>`;
    // Bubble A
    const rA=30+a*2;
    s+=`<circle cx="120" cy="110" r="${rA}" fill="url(#bg1)" opacity="0.9"><animate attributeName="cx" values="120;125;120" dur="3s" repeatCount="indefinite"/><animate attributeName="cy" values="110;105;110" dur="2.5s" repeatCount="indefinite"/></circle>`;
    s+=`<text x="120" y="116" text-anchor="middle" fill="#fff" font-size="28" font-weight="800">${a}</text>`;
    // Plus
    s+=`<text x="220" y="118" text-anchor="middle" fill="#ff8906" font-size="36" font-weight="900">+</text>`;
    // Bubble B
    const rB=30+b*2;
    s+=`<circle cx="320" cy="110" r="${rB}" fill="url(#bg2)" opacity="0.9"><animate attributeName="cx" values="320;315;320" dur="2.8s" repeatCount="indefinite"/><animate attributeName="cy" values="110;115;110" dur="3.2s" repeatCount="indefinite"/></circle>`;
    s+=`<text x="320" y="116" text-anchor="middle" fill="#fff" font-size="28" font-weight="800">${b}</text>`;
    if(showSum){
      s+=`<text x="410" y="118" text-anchor="middle" fill="#ff8906" font-size="36" font-weight="900">=</text>`;
      const rS=35+sum*1.5;
      s+=`<circle cx="470" cy="110" r="${Math.min(rS,55)}" fill="url(#bg3)" opacity="0.9"><animate attributeName="r" values="${Math.min(rS,55)-5};${Math.min(rS,55)};${Math.min(rS,55)-5}" dur="2s" repeatCount="indefinite"/></circle>`;
      s+=`<text x="470" y="118" text-anchor="middle" fill="#fff" font-size="30" font-weight="900">${sum}</text>`;
    } else {
      s+=`<text x="410" y="118" text-anchor="middle" fill="#ff8906" font-size="36" font-weight="900">=</text>`;
      s+=`<circle cx="470" cy="110" r="35" fill="rgba(255,255,255,0.08)" stroke="#64748b" stroke-width="3"><animate attributeName="r" values="33;37;33" dur="2s" repeatCount="indefinite"/></circle>`;
      s+=`<text x="470" y="120" text-anchor="middle" fill="#64748b" font-size="36" font-weight="900">?</text>`;
    }
    return s+`</svg>`;
  }
};
