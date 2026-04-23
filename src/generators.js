import { SVG } from './svg.js';

const shuffle = a => { let r=[...a]; for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];} return r; };
const uniq = (arr,n=4) => shuffle(Array.from(new Set(arr))).slice(0,n);

export const Generators = {
  /* ===== T1: Counting on Number Line ===== */
  t1() {
    return [
      { isLearning:true, title:'Welcome to the Number Line!',
        text:`The <span class="highlight-text">Number Line</span> is like a ruler for math! Numbers grow as we step to the right. Let's start at 0 and count forward — each step is +1!`,
        visual: SVG.numberLine(0,10,[0,1,2,3,4,5],false)
      },
      { isLearning:true, title:'Counting Forward',
        text:`When we count forward from any number, we step to the right on the line. Starting at 3, let's count: 3, 4, 5, 6, 7. That's 5 numbers! The frog hops from 3 to 7.`,
        visual: SVG.numberLine(0,10,[3,7],true)
      },
      ...Array.from({length:3},()=>{
        const t=Math.floor(Math.random()*9)+1;
        return { q:'Which number is hiding under the frog?', visual:SVG.numberLine(0,10,[],false,t), ans:t,
          choices:uniq([t,t+1,t-1>0?t-1:t+3,t+2]), hint:'Look at the numbers just before and after the frog!'};
      }),
      { isLearning:true, title:'Counting on Bigger Lines',
        text:`The number line extends forever! Here's 10 to 20. We count the same way — each tick is the next number. The frog jumps from 12 to 17!`,
        visual: SVG.numberLine(10,20,[12,17],true)
      },
      ...Array.from({length:3},()=>{
        const min=10, max=20, t=Math.floor(Math.random()*9)+11;
        return { q:'Which number is hiding under the frog?', visual:SVG.numberLine(min,max,[],false,t), ans:t,
          choices:uniq([t,t+1,t-1,t+2]), hint:'Check the numbers on either side of the frog!'};
      })
    ];
  },

  /* ===== T2: Addition on Number Line ===== */
  t2() {
    return [
      { isLearning:true, title:'Addition = Hopping Forward!',
        text:`<span class="highlight-text">Addition</span> means hopping forward on the number line! To solve 2 + 3, start at 2 and hop 3 times to the right. Each arc is one hop of +1.`,
        visual: SVG.additionOnLine(0,10,2,3)
      },
      { isLearning:true, title:'Bigger Hops',
        text:`Let's try 4 + 5. Start at 4, make 5 hops: 5, 6, 7, 8, 9. We land on 9! Notice how each little arc shows one step forward.`,
        visual: SVG.additionOnLine(0,10,4,5)
      },
      ...Array.from({length:3},()=>{
        const a=Math.floor(Math.random()*5)+1, b=Math.floor(Math.random()*4)+1, sum=a+b;
        return { q:`Solve: ${a} + ${b} = ?`, visual:SVG.additionOnLine(0,10,a,b), ans:sum,
          choices:uniq([sum,sum+1,sum-1>0?sum-1:sum+3,sum+2]),
          hint:`Start at ${a} and hop ${b} times to the right!`};
      }),
      { isLearning:true, title:'Addition Beyond 10',
        text:`We can add on any part of the number line! 11 + 4 means start at 11 and hop 4 times: 12, 13, 14, 15. We land on 15!`,
        visual: SVG.additionOnLine(10,20,11,4)
      },
      ...Array.from({length:3},()=>{
        const a=Math.floor(Math.random()*5)+10, b=Math.floor(Math.random()*5)+1, sum=a+b;
        return { q:`Solve: ${a} + ${b} = ?`, visual:SVG.additionOnLine(Math.max(0,a-2),Math.min(a+b+3,25),a,b), ans:sum,
          choices:uniq([sum,sum+1,sum-1,sum+2]),
          hint:`Start at ${a} and count ${b} jumps forward!`};
      })
    ];
  },

  /* ===== T3: Addition Pattern ===== */
  t3() {
    return [
      { isLearning:true, title:'Patterns with Addition',
        text:`A <span class="highlight-text">pattern</span> is a sequence where the same number is added each time. Look: 5, 10, 15, 20, 25. The rule is <b>+5</b> every step!`,
        visual: SVG.patternBridge([5,10,15,20,25],'Rule: +5 every jump')
      },
      { isLearning:true, title:'Finding the Rule',
        text:`To discover the rule, subtract two neighbours: 4 - 2 = 2, so the rule is <b>+2</b>. After 6 comes 6 + 2 = 8!`,
        visual: SVG.patternBridge([2,4,6,'?',10],'Rule: +2 → Missing = 8')
      },
      ...Array.from({length:3},()=>{
        const step=[2,3,5][Math.floor(Math.random()*3)];
        const start=Math.floor(Math.random()*5)*step;
        const seq=[start,start+step,start+2*step,start+3*step,start+4*step];
        const mi=4, ans=seq[mi]; let d=[...seq]; d[mi]='?';
        return { q:'Find the missing number:', visual:SVG.patternBridge(d,''), ans,
          choices:uniq([ans,ans+step,ans-step>0?ans-step:ans+step*2,ans+1]),
          hint:'Find the difference between two neighbours to discover the rule!'};
      }),
      { isLearning:true, title:'Gaps in the Middle',
        text:`Sometimes the gap is in the middle! 10, 20, ?, 40, 50 — the rule is +10. So the missing piece is 20 + 10 = 30.`,
        visual: SVG.patternBridge([10,20,'?',40,50],'Rule: +10 → Missing = 30')
      },
      ...Array.from({length:3},()=>{
        const step=[2,5,10][Math.floor(Math.random()*3)];
        const start=Math.floor(Math.random()*10)*step+5;
        const seq=[start,start+step,start+2*step,start+3*step,start+4*step];
        const mi=Math.floor(Math.random()*3)+1, ans=seq[mi]; let d=[...seq]; d[mi]='?';
        return { q:'Find the missing number:', visual:SVG.patternBridge(d,''), ans,
          choices:uniq([ans,ans+step,ans-step>0?ans-step:ans+step*2,ans+1]),
          hint:'Subtract neighbouring numbers to find the rule, then fill the gap!'};
      })
    ];
  },

  /* ===== T4: Introduction to Addition ===== */
  t4() {
    return [
      { isLearning:true, title:'What is Addition?',
        text:`<span class="highlight-text">Addition</span> means putting groups together. If you have 3 🍎 apples and get 2 🍊 oranges, you have 3 + 2 = 5 fruits in total!`,
        visual: SVG.groups(3,2)
      },
      { isLearning:true, title:'Dot Array Method',
        text:`We can count items one by one. Here we have 4 purple dots and 3 green dots. We just count them all up to get the total!`,
        visual: SVG.dotArray(4,3)
      },
      { isLearning:true, title:'Bar Models',
        text:`A <span class="highlight-text">Bar Model</span> shows the parts and the whole. The long top bar is the total (sum), and the shorter bottom bars are the parts that add up to it.`,
        visual: SVG.barModel(5,3)
      },
      { isLearning:true, title:'Number Bonds',
        text:`A <span class="highlight-text">Number Bond</span> is a diagram showing how two parts connect to make a whole. 4 and 2 combine to make 6!`,
        visual: SVG.numberBond(4,2)
      },
      ...Array.from({length:3},()=>{
        const a=Math.floor(Math.random()*5)+1, b=Math.floor(Math.random()*5)+1, sum=a+b;
        const type = Math.floor(Math.random() * 3);
        let visual = '';
        if (type === 0) visual = SVG.groups(a,b,'⭐','🌙',false);
        else if (type === 1) visual = SVG.dotArray(a,b,false);
        else visual = SVG.barModel(a,b);

        return { q:`Find the total: What is ${a} + ${b}?`, visual: visual, ans:sum,
          choices:uniq([sum,sum+1,sum-1>0?sum-1:sum+3,sum+2]),
          hint:'Count all items from both groups to find the total!'};
      })
    ];
  },

  /* ===== T5: Intellia's Method of Addition ===== */
  t5() {
    return [
      { isLearning:true, title:'Intellia\'s Split-and-Merge',
        text:`<span class="highlight-text">Intellia's Method</span> is a powerful trick! To add numbers, we <b>split</b> one number to first <b>make 10</b>, then add the leftover. This makes hard sums easy!`,
        visual: SVG.splitMerge(8,5)
      },
      { isLearning:true, title:'The 10-Frame Helper',
        text:`A <span class="highlight-text">10-Frame</span> has 10 slots. If we fill 8 slots, there are 2 empty. Adding 5 fills the remaining 2 slots (making 10), and leaves 3 outside. 10 + 3 = 13!`,
        visual: SVG.tenFrameAddition(8,5)
      },
      { isLearning:true, title:'How It Works: 7 + 6',
        text:`Step 1: We need 3 more to make 7 into 10. Split 6 into 3 and 3.<br>Step 2: 7 + 3 = 10.<br>Step 3: 10 + 3 = <b>13</b>. Done!`,
        visual: SVG.splitMerge(7,6)
      },
      { isLearning:true, title:'Another 10-Frame Example',
        text:`Let's add 9 and 4. The 9 frame has 1 empty slot. The 4 fills that 1 slot to make 10, leaving 3 left over. Result is 13!`,
        visual: SVG.tenFrameAddition(9,4)
      },
      ...Array.from({length:4},()=>{
        const a=Math.floor(Math.random()*3)+6, b=Math.floor(Math.random()*4)+3;
        const sum=a+b;
        const isFrame = Math.random() > 0.5;
        return { q:`Use Intellia's method: ${a} + ${b} = ?`, visual: isFrame ? SVG.tenFrameAddition(a,b) : SVG.splitMerge(a,b), ans:sum,
          choices:uniq([sum,sum+1,sum-1,sum+2]),
          hint:`Split ${b} to make ${a} into 10 first, then add the rest!`};
      })
    ];
  },

  /* ===== T6: Visualisation Bubble ===== */
  t6() {
    return [
      { isLearning:true, title:'Addition Bubbles',
        text:`Imagine numbers live inside <span class="highlight-text">bubbles</span>. When two bubbles float together and merge, their values combine into a single, bigger bubble!`,
        visual: SVG.bubbles(3,4,true)
      },
      { isLearning:true, title:'Bigger Bubbles',
        text:`The bigger the number, the bigger the bubble! Watch 7 and 5 merge into a glowing bubble of 12. The size grows with the sum!`,
        visual: SVG.bubbles(7,5,true)
      },
      ...Array.from({length:3},()=>{
        const a=Math.floor(Math.random()*8)+1, b=Math.floor(Math.random()*8)+1, sum=a+b;
        return { q:'What number forms when these bubbles merge?', visual:SVG.bubbles(a,b,false), ans:sum,
          choices:uniq([sum,sum+1,sum-1>0?sum-1:sum+3,sum+2]),
          hint:'Add the numbers inside the two coloured bubbles!'};
      }),
      { isLearning:true, title:'Chain Merging',
        text:`We can chain merges! 4 + 3 = 7, then 7 + 6 = 13. Each merge feeds into the next. This is how we add multiple numbers step by step.`,
        visual: SVG.bubbles(7,6,true)
      },
      ...Array.from({length:3},()=>{
        const a=Math.floor(Math.random()*10)+5, b=Math.floor(Math.random()*10)+3, sum=a+b;
        return { q:'What number forms when these bubbles merge?', visual:SVG.bubbles(a,b,false), ans:sum,
          choices:uniq([sum,sum+1,sum-1>0?sum-1:sum+3,sum+2]),
          hint:'Simply add the two numbers inside the bubbles!'};
      })
    ];
  }
};
