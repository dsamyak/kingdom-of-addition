import { SVG } from './svg.js';

const shuffle = a => { let r=[...a]; for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];} return r; };
const uniq = (arr,n=4) => shuffle(Array.from(new Set(arr.map(Number).filter(x=>!isNaN(x))))).slice(0,n);
const makeChoices = (ans, spread=2) => {
  const opts = [ans];
  while(opts.length<4){
    const off = Math.floor(Math.random()*spread*2+1)-spread;
    const v = ans+off;
    if(v>0 && !opts.includes(v)) opts.push(v);
  }
  return shuffle(opts);
};

export const Generators = {
  /* ===== T1: Counting on Number Line ===== */
  t1() {
    const items = [
      { isLearning:true, title:'Welcome to the Number Line!',
        text:`The <span class="highlight-text">Number Line</span> is like a ruler for math! Numbers grow as we step to the right. Let's start at 0 and count forward — each step is +1!`,
        visual: SVG.numberLine(0,10,[0,1,2,3,4,5],false)
      },
      { isLearning:true, title:'Counting Forward',
        text:`When we count forward from any number, we step to the right on the line. Starting at 3, let's count: 3, 4, 5, 6, 7. That's 5 numbers!`,
        visual: SVG.numberLine(0,10,[3,7],true)
      }
    ];
    // 10 questions: small range 0-10
    for(let i=0;i<10;i++){
      const t=Math.floor(Math.random()*9)+1;
      items.push({ q:'Which number is hiding under the frog?', visual:SVG.numberLine(0,10,[],false,t), ans:t,
        choices:makeChoices(t,2), hint:'Look at the numbers just before and after the frog!'});
    }
    items.push({ isLearning:true, title:'Counting on Bigger Lines',
      text:`The number line extends forever! Here's 10 to 20. We count the same way — each tick is the next number.`,
      visual: SVG.numberLine(10,20,[12,17],true)
    });
    // 10 questions: bigger range
    for(let i=0;i<10;i++){
      const mn=10, mx=20, t=Math.floor(Math.random()*9)+11;
      items.push({ q:'Which number is hiding under the frog?', visual:SVG.numberLine(mn,mx,[],false,t), ans:t,
        choices:makeChoices(t,2), hint:'Check the numbers on either side of the frog!'});
    }
    return items;
  },

  /* ===== T2: Addition on Number Line ===== */
  t2() {
    const items = [
      { isLearning:true, title:'Addition = Hopping Forward!',
        text:`<span class="highlight-text">Addition</span> means hopping forward on the number line! To solve 2 + 3, start at 2 and hop 3 times to the right.`,
        visual: SVG.additionOnLine(0,10,2,3)
      },
      { isLearning:true, title:'Bigger Hops',
        text:`Let's try 4 + 5. Start at 4, make 5 hops: 5, 6, 7, 8, 9. We land on 9!`,
        visual: SVG.additionOnLine(0,10,4,5)
      }
    ];
    for(let i=0;i<10;i++){
      const a=Math.floor(Math.random()*5)+1, b=Math.floor(Math.random()*4)+1, sum=a+b;
      items.push({ q:`Solve: ${a} + ${b} = ?`, visual:SVG.additionOnLine(0,10,a,b,false), ans:sum,
        choices:makeChoices(sum,2), hint:`Start at ${a} and hop ${b} times to the right!`});
    }
    items.push({ isLearning:true, title:'Addition Beyond 10',
      text:`We can add on any part of the number line! 11 + 4 means start at 11 and hop 4 times to land on 15!`,
      visual: SVG.additionOnLine(10,20,11,4)
    });
    for(let i=0;i<10;i++){
      const a=Math.floor(Math.random()*5)+10, b=Math.floor(Math.random()*5)+1, sum=a+b;
      items.push({ q:`Solve: ${a} + ${b} = ?`, visual:SVG.additionOnLine(Math.max(0,a-2),Math.min(a+b+3,25),a,b,false), ans:sum,
        choices:makeChoices(sum,3), hint:`Start at ${a} and count ${b} jumps forward!`});
    }
    return items;
  },

  /* ===== T3: Addition Pattern ===== */
  t3() {
    const items = [
      { isLearning:true, title:'What is a Pattern?',
        text:`A <span class="highlight-text">pattern</span> is a sequence where the same number is added each time. Look: 2, 4, 6, 8, 10. The rule is <b>+2</b> every step!`,
        visual: SVG.patternBridge([2,4,6,8,10],'+2')
      },
      { isLearning:true, title:'Finding the Rule',
        text:`To discover the rule, subtract two neighbours: 10 − 5 = 5, so the rule is <b>+5</b>. After 20 comes 20 + 5 = 25!`,
        visual: SVG.patternBridge([5,10,15,20,25],'+5')
      }
    ];
    // Pattern +2 (6 questions)
    for(let i=0;i<6;i++){
      const step=2;
      const start=Math.floor(Math.random()*6)*2+2;
      const seq=[start,start+step,start+2*step,start+3*step,start+4*step];
      const mi=Math.floor(Math.random()*5);
      const ans=seq[mi]; const d=[...seq]; d[mi]='?';
      items.push({ q:`Find the missing number (Rule: +${step}):`, visual:SVG.patternBridge(d,`+${step}`), ans,
        choices:makeChoices(ans,step), hint:`The rule is +${step}. Use the numbers before and after the gap!`});
    }
    items.push({ isLearning:true, title:'Patterns with +3',
      text:`Now let's try +3 patterns: 3, 6, 9, 12, 15. Each number is 3 more than the one before it!`,
      visual: SVG.patternBridge([3,6,9,12,15],'+3')
    });
    // Pattern +3 (5 questions)
    for(let i=0;i<5;i++){
      const step=3;
      const start=Math.floor(Math.random()*5)*3+3;
      const seq=[start,start+step,start+2*step,start+3*step,start+4*step];
      const mi=Math.floor(Math.random()*5);
      const ans=seq[mi]; const d=[...seq]; d[mi]='?';
      items.push({ q:`Find the missing number (Rule: +${step}):`, visual:SVG.patternBridge(d,`+${step}`), ans,
        choices:makeChoices(ans,step), hint:`Each number is ${step} more than the previous one.`});
    }
    items.push({ isLearning:true, title:'Patterns with +5 and +10',
      text:`Bigger jumps follow the same idea! 10, 20, 30, 40, 50 — that's +10. Easy when you see the rule!`,
      visual: SVG.patternBridge([10,20,30,40,50],'+10')
    });
    // Pattern +5/+10 (4 questions)
    for(let i=0;i<4;i++){
      const step=[5,10][Math.floor(Math.random()*2)];
      const start=Math.floor(Math.random()*5)*step+step;
      const seq=[start,start+step,start+2*step,start+3*step,start+4*step];
      const mi=Math.floor(Math.random()*5);
      const ans=seq[mi]; const d=[...seq]; d[mi]='?';
      items.push({ q:`Find the missing number (Rule: +${step}):`, visual:SVG.patternBridge(d,`+${step}`), ans,
        choices:makeChoices(ans,step), hint:`The rule is +${step}. Subtract neighbours to confirm!`});
    }
    // 5 more mixed (total = 6+5+4+5 = 20)
    for(let i=0;i<5;i++){
      const step=[2,3,4,5,10][Math.floor(Math.random()*5)];
      const start=Math.floor(Math.random()*8)+1;
      const seq=[start,start+step,start+2*step,start+3*step,start+4*step];
      const mi=Math.floor(Math.random()*5);
      const ans=seq[mi]; const d=[...seq]; d[mi]='?';
      items.push({ q:'Find the missing number:', visual:SVG.patternBridge(d,`+${step}`), ans,
        choices:makeChoices(ans,step), hint:`Subtract two neighbours to find the rule, then fill the gap!`});
    }
    return items;
  },

  /* ===== T4: Introduction to Addition ===== */
  t4() {
    const items = [
      { isLearning:true, title:'What is Addition?',
        text:`<span class="highlight-text">Addition</span> means putting groups together. If you have 3 🍎 and get 2 🍊, you have 3 + 2 = 5 fruits!`,
        visual: SVG.groups(3,2)
      },
      { isLearning:true, title:'Dot Array Method',
        text:`We can count items one by one. Here we have 4 purple dots and 3 green dots — count them all to get the total!`,
        visual: SVG.dotArray(4,3)
      },
      { isLearning:true, title:'Bar Models',
        text:`A <span class="highlight-text">Bar Model</span> shows the parts and the whole. The top bar is the total, and bottom bars are the parts.`,
        visual: SVG.barModel(5,3)
      },
      { isLearning:true, title:'Number Bonds',
        text:`A <span class="highlight-text">Number Bond</span> shows how two parts connect to make a whole. 4 and 2 combine to make 6!`,
        visual: SVG.numberBond(4,2)
      }
    ];
    const visTypes = ['groups','dots','bar','bond'];
    const emojis = [['⭐','🌙'],['🍎','🍊'],['🐱','🐶'],['🌸','🌻']];
    for(let i=0;i<20;i++){
      const a=Math.floor(Math.random()*7)+1, b=Math.floor(Math.random()*7)+1, sum=a+b;
      const type = visTypes[i%4];
      const ep = emojis[Math.floor(Math.random()*emojis.length)];
      let visual = '';
      if(type==='groups') visual = SVG.groups(a,b,ep[0],ep[1],false);
      else if(type==='dots') visual = SVG.dotArray(a,b,false);
      else if(type==='bar') visual = SVG.barModel(a,b,false);
      else visual = SVG.numberBond(a,b,false);
      items.push({ q:`What is ${a} + ${b}?`, visual, ans:sum,
        choices:makeChoices(sum,2), hint:'Count all items from both groups to find the total!'});
    }
    return items;
  },

  /* ===== T5: Intellia's Method of Addition ===== */
  t5() {
    const items = [
      { isLearning:true, title:'Intellia\'s Split-and-Merge',
        text:`<span class="highlight-text">Intellia's Method</span> is a powerful trick! To add numbers, we <b>split</b> one number to first <b>make 10</b>, then add the leftover. This makes hard sums easy!`,
        visual: SVG.splitMerge(8,5)
      },
      { isLearning:true, title:'The 10-Frame Helper',
        text:`A <span class="highlight-text">10-Frame</span> has 10 slots. Fill 8 slots, there are 2 empty. Adding 5 fills the 2 empty slots (making 10), and leaves 3 outside. 10 + 3 = 13!`,
        visual: SVG.tenFrameAddition(8,5)
      },
      { isLearning:true, title:'How It Works: 7 + 6',
        text:`Step 1: We need 3 more to make 7 into 10. Split 6 into 3 and 3.<br>Step 2: 7 + 3 = 10.<br>Step 3: 10 + 3 = <b>13</b>. Done!`,
        visual: SVG.splitMerge(7,6)
      },
      { isLearning:true, title:'Another Example: 9 + 4',
        text:`The 9 frame has 1 empty slot. Split 4 into 1 and 3. Fill that 1 slot to make 10, leaving 3 left over. 10 + 3 = 13!`,
        visual: SVG.tenFrameAddition(9,4)
      }
    ];
    // Pairs that need make-10
    const pairs = [[8,3],[7,4],[6,5],[9,3],[8,4],[7,5],[6,6],[9,5],[8,6],[7,6],[6,7],[9,4],[8,5],[7,8],[6,8],[9,6],[8,7],[7,9],[9,7],[8,8]];
    const used = shuffle(pairs).slice(0,20);
    for(let i=0;i<20;i++){
      const [a,b] = used[i%used.length];
      const sum=a+b;
      const need=10-a;
      const left=b-need;
      const isFrame = i%3===0;
      const isSplit = i%3===1;
      let visual;
      if(isFrame) visual = SVG.tenFrameAddition(a,b,false);
      else if(isSplit) visual = SVG.splitMerge(a,b,false);
      else visual = SVG.splitMerge(a,b,false);
      items.push({ q:`Use Intellia's method: ${a} + ${b} = ?`,
        visual, ans:sum,
        choices:makeChoices(sum,2),
        hint:`Split ${b} into ${need} and ${left}. Make 10 with ${a}+${need}, then add ${left}!`});
    }
    return items;
  },

  /* ===== T6: Visualisation Bubble ===== */
  t6() {
    const items = [
      { isLearning:true, title:'Addition Bubbles',
        text:`Imagine numbers live inside <span class="highlight-text">bubbles</span>. When two bubbles float together and merge, their values combine into a single bigger bubble!`,
        visual: SVG.bubbles(3,4,true)
      },
      { isLearning:true, title:'Bigger Bubbles',
        text:`The bigger the number, the bigger the bubble! Watch 7 and 5 merge into a glowing bubble of 12.`,
        visual: SVG.bubbles(7,5,true)
      },
      { isLearning:true, title:'Chain Merging',
        text:`We can chain merges! 4 + 3 = 7, then 7 + 6 = 13. Each merge feeds into the next.`,
        visual: SVG.bubbles(7,6,true)
      }
    ];
    // small numbers (10 questions)
    for(let i=0;i<10;i++){
      const a=Math.floor(Math.random()*8)+1, b=Math.floor(Math.random()*8)+1, sum=a+b;
      items.push({ q:'What number forms when these bubbles merge?', visual:SVG.bubbles(a,b,false), ans:sum,
        choices:makeChoices(sum,2), hint:'Add the numbers inside the two coloured bubbles!'});
    }
    items.push({ isLearning:true, title:'Bigger Number Bubbles',
      text:`Even larger numbers work the same way! 12 + 9 = 21. The result bubble grows with the sum!`,
      visual: SVG.bubbles(12,9,true)
    });
    // larger numbers (10 questions)
    for(let i=0;i<10;i++){
      const a=Math.floor(Math.random()*12)+5, b=Math.floor(Math.random()*10)+3, sum=a+b;
      items.push({ q:'What number forms when these bubbles merge?', visual:SVG.bubbles(a,b,false), ans:sum,
        choices:makeChoices(sum,3), hint:'Simply add the two numbers inside the bubbles!'});
    }
    return items;
  },

  /* ===== T7: Vertical Addition ===== */
  t7() {
    const items = [
      { isLearning:true, title:'Vertical Addition',
        text:`When we add big numbers, we stack them! Add the <b>Ones</b> column first (right), then the <b>Tens</b> column (left).`,
        visual: SVG.verticalAddition(12, 15)
      },
      { isLearning:true, title:'No Carry Example',
        text:`Let's add 23 + 14. Ones: 3 + 4 = 7. Tens: 2 + 1 = 3. Answer: 37! No carrying needed here.`,
        visual: SVG.verticalAddition(23, 14)
      },
      { isLearning:true, title:'Carrying Over',
        text:`If the Ones column adds up to 10 or more, we <span class="highlight-text">carry over</span> the extra Ten! Watch 18 + 14: Ones 8+4=12, write 2 carry 1.`,
        visual: SVG.verticalAddition(18, 14)
      },
      { isLearning:true, title:'Big Numbers Carry',
        text:`37 + 45: Ones 7+5=12 (write 2, carry 1). Tens 1+3+4=8. Answer: 82!`,
        visual: SVG.verticalAddition(37, 45)
      }
    ];
    // No carry questions (8)
    for(let i=0;i<8;i++){
      const aT=Math.floor(Math.random()*4)+1, aO=Math.floor(Math.random()*4)+1;
      const bT=Math.floor(Math.random()*3)+1, bO=Math.floor(Math.random()*Math.min(4,9-aO))+1;
      const a=aT*10+aO, b=bT*10+bO, sum=a+b;
      items.push({ q:`Add vertically: ${a} + ${b} = ?`, visual:SVG.verticalAddition(a,b,false), ans:sum,
        choices:makeChoices(sum,3), hint:'Add the Ones column first, then the Tens column!'});
    }
    // Carry questions (12)
    for(let i=0;i<12;i++){
      const aT=Math.floor(Math.random()*5)+2, aO=Math.floor(Math.random()*4)+6;
      const bT=Math.floor(Math.random()*3)+1, bO=Math.floor(Math.random()*4)+5;
      const a=aT*10+aO, b=bT*10+bO, sum=a+b;
      items.push({ q:`Solve (watch for carry!): ${a} + ${b} = ?`, visual:SVG.verticalAddition(a,b,false), ans:sum,
        choices:makeChoices(sum,5), hint:"Don't forget to carry the 1 from the Ones to the Tens column!"});
    }
    return items;
  },

  /* ===== T8: Word Problems ===== */
  t8() {
    const items = [
      { isLearning:true, title:'Math in the Real World',
        text:`Addition is everywhere! If you have <b>3 apples</b> and your friend gives you <b>2 more</b>, you are adding them together: 3 + 2 = 5.`,
        visual: SVG.groups(3,2,'🍎','🍎')
      },
      { isLearning:true, title:'Signal Words',
        text:`"Total", "Sum", "Altogether", "In all", "How many" — these words usually mean we need to <span class="highlight-text">add</span>!`,
        visual: SVG.barModel(5,4)
      }
    ];
    const scenarios = [
      {emoji:'🎈', name:'balloons'}, {emoji:'🧸', name:'toys'},
      {emoji:'🍪', name:'cookies'}, {emoji:'⭐', name:'stars'},
      {emoji:'📚', name:'books'}, {emoji:'🌸', name:'flowers'},
      {emoji:'🐱', name:'cats'}, {emoji:'🍕', name:'pizza slices'}
    ];
    const templates = [
      (a,b,n)=>`You have ${a} ${n} and find ${b} more. How many ${n} do you have altogether?`,
      (a,b,n)=>`There are ${a} ${n} in a box and ${b} ${n} on the table. What is the total?`,
      (a,b,n)=>`Anna has ${a} ${n} and Ben has ${b} ${n}. How many do they have in all?`,
      (a,b,n)=>`A shop sold ${a} ${n} in the morning and ${b} ${n} in the evening. How many were sold in total?`,
      (a,b,n)=>`There were ${a} ${n} on the left and ${b} ${n} on the right. How many ${n} are there altogether?`
    ];
    for(let i=0;i<20;i++){
      const sc = scenarios[Math.floor(Math.random()*scenarios.length)];
      const a = Math.floor(Math.random()*8)+2, b = Math.floor(Math.random()*8)+2, sum=a+b;
      const tpl = templates[Math.floor(Math.random()*templates.length)];
      items.push({ q: tpl(a,b,sc.name), visual:SVG.groups(a,b,sc.emoji,sc.emoji,false), ans:sum,
        choices:makeChoices(sum,2), hint:`Add ${a} and ${b} to find the total number of ${sc.name}.`});
    }
    return items;
  }
};
