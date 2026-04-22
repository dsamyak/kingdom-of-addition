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
      { isLearning:true, title:'Combining Groups',
        text:`Think of addition as merging two baskets. Basket A has 4 items, Basket B has 3 items. Together: 4 + 3 = 7 items!`,
        visual: SVG.groups(4,3,'🟣','🔵')
      },
      ...Array.from({length:3},()=>{
        const a=Math.floor(Math.random()*5)+1, b=Math.floor(Math.random()*5)+1, sum=a+b;
        const emojis=[['🍎','🍊'],['🟣','🔵'],['⭐','🌙'],['🐱','🐶']][Math.floor(Math.random()*4)];
        return { q:`Count all items. What is ${a} + ${b}?`, visual:SVG.groups(a,b,emojis[0],emojis[1],false), ans:sum,
          choices:uniq([sum,sum+1,sum-1>0?sum-1:sum+3,sum+2]),
          hint:'Count all items in both boxes together!'};
      }),
      { isLearning:true, title:'Order Doesn\'t Matter!',
        text:`A magical rule: 5 + 3 = 3 + 5. Both equal 8! This is called the <span class="highlight-text">Commutative Property</span>. Swapping doesn't change the total.`,
        visual: SVG.groups(5,3,'🌟','💎')
      },
      ...Array.from({length:3},()=>{
        const a=Math.floor(Math.random()*6)+2, b=Math.floor(Math.random()*6)+2, sum=a+b;
        return { q:`What is ${a} + ${b}?`, visual:SVG.groups(a,b,'🟢','🔴',false), ans:sum,
          choices:uniq([sum,sum+1,sum-1>0?sum-1:sum+3,a*b>sum?a*b:sum+4]),
          hint:'Count the green circles, then count the red ones, and add them!'};
      })
    ];
  },

  /* ===== T5: Intellia's Method of Addition ===== */
  t5() {
    return [
      { isLearning:true, title:'Intellia\'s Split-and-Merge',
        text:`<span class="highlight-text">Intellia's Method</span> is a powerful mental math trick! To add numbers, we <b>split</b> one number to first <b>make 10</b>, then add the leftover. This makes hard sums easy!`,
        visual: SVG.splitMerge(8,5)
      },
      { isLearning:true, title:'How It Works: 7 + 6',
        text:`Step 1: We need 3 more to make 7 into 10. Split 6 into 3 and 3.<br>Step 2: 7 + 3 = 10.<br>Step 3: 10 + 3 = <b>13</b>. Done! Faster than counting one by one.`,
        visual: SVG.splitMerge(7,6)
      },
      { isLearning:true, title:'The 10-Frame Helper',
        text:`A <span class="highlight-text">10-Frame</span> has 10 slots. Fill it up first — whatever is left over goes outside. 8 fills 8 slots; adding 5 fills the remaining 2 and leaves 3 outside. Total: 13!`,
        visual: SVG.tenFrame(10)
      },
      ...Array.from({length:3},()=>{
        const a=Math.floor(Math.random()*3)+6, b=Math.floor(Math.random()*4)+3;
        const sum=a+b;
        return { q:`Use Intellia's method: ${a} + ${b} = ?`, visual:SVG.splitMerge(a,b), ans:sum,
          choices:uniq([sum,sum+1,sum-1,sum+2]),
          hint:`Split ${b} to make ${a} into 10 first, then add the rest!`};
      }),
      { isLearning:true, title:'Intellia\'s Formula',
        text:`<b>Formula:</b> a + b = (a + x) + (b − x) where x = 10 − a.<br><br>Example: 9 + 7 → x = 10 − 9 = 1 → Split 7 into 1 and 6 → 10 + 6 = <b>16</b>`,
        visual: SVG.splitMerge(9,7)
      },
      ...Array.from({length:3},()=>{
        const a=Math.floor(Math.random()*3)+7, b=Math.floor(Math.random()*5)+4;
        const sum=a+b;
        return { q:`Use Intellia's method: ${a} + ${b} = ?`, visual:SVG.splitMerge(a,b), ans:sum,
          choices:uniq([sum,sum+1,sum-1>0?sum-1:sum+3,sum+2]),
          hint:`Find how much ${a} needs to reach 10, split ${b} that way!`};
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
