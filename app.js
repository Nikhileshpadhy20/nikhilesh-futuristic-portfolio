const canvas=document.getElementById("space"),ctx=canvas.getContext("2d"),stars=[];let W,H,D;
function size(){W=innerWidth;H=innerHeight;D=Math.min(devicePixelRatio,1.5);canvas.width=W*D;canvas.height=H*D;ctx.setTransform(D,0,0,D,0,0);stars.length=0;for(let i=0;i<Math.min(220,W*H/8000);i++)stars.push({x:Math.random()*W,y:Math.random()*H,s:Math.random()*1.4+.2,v:Math.random()*.25+.03})}size();addEventListener("resize",size);
(function draw(){ctx.fillStyle="#02050b";ctx.fillRect(0,0,W,H);for(const s of stars){s.y+=s.v;if(s.y>H)s.y=0;ctx.fillStyle="rgba(95,190,255,"+(0.2+s.s/2)+")";ctx.fillRect(s.x,s.y,s.s,s.s)}requestAnimationFrame(draw)})();
const scene=document.getElementById("scene");addEventListener("pointermove",e=>{let x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;scene.style.transform=`translate(${x*10}px,${y*6}px) rotateY(${x*1.5}deg)`});
// REAL AI AGENT — OpenAI Responses API via /api/chat
const chatHistory=[];
let aiBusy=false;
function setAgentState(text){if(state)state.textContent=text}
function showAgent(text,voice=true){bubble.textContent=text;if(voice)speak(text)}
async function askAgent(question){
  const q=String(question||'').trim(); if(!q||aiBusy)return;
  aiBusy=true; setAgentState('THINKING'); consoleEl.textContent='AI PROCESSING';
  showAgent('Thinking…',false);
  chatHistory.push({role:'user',content:q});
  try{
    const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:chatHistory.slice(-12)})});
    const data=await r.json();
    if(!r.ok) throw new Error(data.error||'Agent unavailable');
    const answerText=data.text||'I could not generate a response.';
    chatHistory.push({role:'assistant',content:answerText});
    showAgent(answerText,true); setAgentState('ONLINE / READY'); consoleEl.textContent='READY';
  }catch(err){
    chatHistory.pop();
    showAgent('The AI agent is not connected yet. The website is ready, but the server needs its OPENAI_API_KEY configured.',false);
    setAgentState('CONFIG REQUIRED'); consoleEl.textContent='API NOT CONFIGURED';
  }finally{aiBusy=false}
}
function openAI(){ai.classList.add('open');if(!chatHistory.length)speak("Hi! I'm Nikhilesh's AI assistant. Ask me anything.")}
document.getElementById('talk').onclick=openAI;
document.getElementById('close').onclick=()=>{ai.classList.remove('open');speechSynthesis?.cancel();bars.classList.remove('active');setAgentState('ONLINE / READY');consoleEl.textContent='READY'};
document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{openAI();const q={about:'Tell me about Nikhilesh.',skills:'What skills does Nikhilesh have?',projects:'Explain Nikhilesh\'s projects.',contact:'How can I contact Nikhilesh?'}[b.dataset.q]||b.dataset.q;askAgent(q)});
document.getElementById('send').onclick=()=>{const q=input.value.trim();if(!q)return;input.value='';openAI();askAgent(q)};
input.onkeydown=e=>{if(e.key==='Enter')document.getElementById('send').click()};
document.getElementById('sound').onclick=()=>speak('Voice output is active. Ask me anything.');
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(SR){let r=new SR;r.lang='en-IN';r.interimResults=false;r.onresult=e=>{input.value=e.results[0][0].transcript;document.getElementById('send').click()};r.onerror=()=>setAgentState('VOICE ERROR');document.getElementById('mic').onclick=()=>{openAI();setAgentState('LISTENING — SPEAK NOW');r.start()}}
else document.getElementById('mic').onclick=()=>alert('Speech recognition is unavailable in this browser. Try Chrome.');

const pd={cloud:["01","Cloud Storage File System","A scalable cloud storage concept using AWS object storage, access control and monitoring.",["AWS","S3","IAM"]],rait:["02","RAIT — ResolveAI Issue Tracker","An AI-powered grievance management concept using serverless AWS workflows.",["AI","AWS","SERVERLESS"]],vlan:["03","Network Segmentation & VLAN Design","A secure enterprise network topology using VLAN segmentation and controlled traffic paths.",["VLAN","CISCO","SECURITY"]],street:["04","Automated StreetLight Control","Smart street-light automation and simulation using sensor-driven control logic.",["IOT","OPENMODELICA","AUTOMATION"]]};
const modal=document.getElementById("modal");document.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>{let d=pd[b.dataset.p];modal.style.display="flex";document.getElementById("mno").textContent=d[0];document.getElementById("mt").textContent=d[1];document.getElementById("md").textContent=d[2];document.getElementById("tags").textContent=d[3].join("  •  ");document.getElementById("mspeak").onclick=()=>speak(d[1]+". "+d[2])});document.getElementById("mx").onclick=()=>modal.style.display="none";document.querySelector("#modal>div").onclick=()=>modal.style.display="none";

document.querySelectorAll(".tech-universe button").forEach(btn=>btn.onclick=()=>{
 const t=btn.dataset.tech;
 const m={AWS:"AWS is my cloud platform for infrastructure and services.",DOCKER:"Docker lets me package applications into portable containers.",KUBERNETES:"Kubernetes orchestrates containers and scalable deployments.",TERRAFORM:"Terraform lets me define and provision infrastructure as code.",LINUX:"Linux is a core operating system foundation for my cloud and DevOps work.","GIT / GITHUB":"Git and GitHub handle version control and collaboration.","CI / CD":"CI/CD automates build, test and deployment workflows.","PYTHON / JAVA":"Python and Java are programming tools in my development toolkit."};
 if(typeof openAI==="function") openAI();
 if(typeof bubble!=="undefined") bubble.textContent=m[t];
 if(typeof speak==="function") speak(m[t]);
});

/* V7 interaction layer */
(function(){
 const boot=document.getElementById("bootScreen");
 setTimeout(()=>boot&&boot.classList.add("done"),1900);

 const cursor=document.querySelector(".cursor-orb");
 window.addEventListener("pointermove",e=>{
   document.documentElement.style.setProperty("--mx",e.clientX+"px");
   document.documentElement.style.setProperty("--my",e.clientY+"px");
   if(cursor){cursor.style.left=e.clientX+"px";cursor.style.top=e.clientY+"px"}
 });
 document.querySelectorAll("a,button").forEach(el=>{
   el.addEventListener("mouseenter",()=>cursor&& (cursor.style.width="30px",cursor.style.height="30px"));
   el.addEventListener("mouseleave",()=>cursor&& (cursor.style.width="18px",cursor.style.height="18px"));
 });

 const toast=document.getElementById("hudToast");
 window.sigToast=(text)=>{
   if(!toast)return;
   toast.textContent=text;toast.classList.add("show");
   clearTimeout(window.__toast);window.__toast=setTimeout(()=>toast.classList.remove("show"),1800);
 };

 const palette=document.getElementById("commandPalette"), input=document.getElementById("cmdInput");
 const openPalette=()=>{palette.classList.add("open");palette.setAttribute("aria-hidden","false");setTimeout(()=>input&&input.focus(),80)};
 const closePalette=()=>{palette.classList.remove("open");palette.setAttribute("aria-hidden","true")};
 window.addEventListener("keydown",e=>{
   if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openPalette()}
   if(e.key==="Escape")closePalette();
   if(["1","2","3","4","5"].includes(e.key)&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){
     const b=document.querySelector('.cmd-results button[data-go="'+({1:"home",2:"skills",3:"projects",4:"contact",5:"resume"}[e.key])+'"]');b&&b.click();
   }
 });
 palette&&palette.addEventListener("click",e=>{if(e.target===palette)closePalette()});
 document.querySelectorAll(".cmd-results button").forEach(b=>b.addEventListener("click",()=>{
   const id=b.dataset.go; closePalette(); sigToast("NAVIGATING // "+id.toUpperCase());
   if(id==="resume"){const a=document.createElement("a");a.href="resume.pdf";a.target="_blank";a.click();return}
   const el=document.getElementById(id)||document.querySelector("#"+id+" , section."+id);
   if(el)el.scrollIntoView({behavior:"smooth"});
 }));
 input&&input.addEventListener("input",()=>{
   const q=input.value.toLowerCase();
   document.querySelectorAll(".cmd-results button").forEach(b=>b.style.display=b.textContent.toLowerCase().includes(q)?"block":"none");
 });

 const obs=new IntersectionObserver(entries=>entries.forEach(x=>x.isIntersecting&&x.target.classList.add("visible")),{threshold:.14});
 document.querySelectorAll(".reveal").forEach(x=>obs.observe(x));

 const consoleEl=document.getElementById("twinConsole");
 if(consoleEl){
   consoleEl.addEventListener("pointermove",e=>{
     const r=consoleEl.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
     consoleEl.style.transform=`rotateY(${x*8}deg) rotateX(${-y*7}deg)`;
   });
   consoleEl.addEventListener("pointerleave",()=>consoleEl.style.transform="");
 }
 document.getElementById("runScan")?.addEventListener("click",()=>{
   const log=document.getElementById("consoleLog");
   const lines=["Scanning portfolio modules...","Cloud stack verified: AWS / Docker / Kubernetes / Terraform","Projects indexed: 4","Resume module linked: ONLINE","Digital twin interface: READY"];
   log.innerHTML="";
   lines.forEach((t,i)=>setTimeout(()=>{log.innerHTML+=`<p><b>&gt;</b> ${t}</p>`},i*450));
   sigToast("SYSTEM SCAN // COMPLETE");
 });
 document.getElementById("openTwin")?.addEventListener("click",()=>{
   sigToast("DIGITAL TWIN // OPEN");
   if(typeof openAI==="function")openAI();
   document.getElementById("twinConsole")?.scrollIntoView({behavior:"smooth",block:"center"});
 });
})();

/* V8 digital-universe interaction */
(function(){
 const stage=document.getElementById("universeStage"), readout=document.getElementById("universeReadout");
 const descriptions={
  AWS:"AWS — cloud infrastructure, storage, compute and services.",
  Docker:"Docker — lightweight application containers and repeatable environments.",
  Kubernetes:"Kubernetes — orchestration for containerized workloads.",
  Terraform:"Terraform — infrastructure as code for repeatable provisioning.",
  Linux:"Linux — the operating-system foundation for cloud and DevOps work.",
  GitHub:"GitHub — source control, collaboration and project delivery."
 };
 document.querySelectorAll(".planet").forEach(p=>p.addEventListener("click",()=>{
   document.querySelectorAll(".planet").forEach(x=>x.classList.remove("active"));p.classList.add("active");
   const name=p.dataset.planet, text=descriptions[name];
   if(readout)readout.innerHTML=`${name.toUpperCase()} <b>↗</b> <span style="color:#6e8ca2">${text}</span>`;
   if(typeof sigToast==="function")sigToast(name.toUpperCase()+" // NODE SELECTED");
   if(typeof openAI==="function")openAI();
   if(typeof bubble!=="undefined")bubble.textContent=text;
   if(typeof speak==="function")speak(text);
 }));
 if(stage){
   stage.addEventListener("pointermove",e=>{
     const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
     stage.style.transform=`perspective(1000px) rotateY(${x*2.5}deg) rotateX(${-y*2}deg)`;
   });
   stage.addEventListener("pointerleave",()=>stage.style.transform="");
 }
})();
