const baseInput=document.getElementById('base');
const fromInput=document.getElementById('from');
const bodyInput=document.getElementById('body');
const out=document.getElementById('out');
const send=document.getElementById('send');
const pv=document.getElementById('preview');
function updatePreview(){
  const base=baseInput.value.trim().replace(/\/$/,'');
  pv.textContent=base?base+'/whatsapp-endpoint':'';
}
function setFilled(el){
  if(el.value.trim()) el.classList.add('filled'); else el.classList.remove('filled');
}
baseInput.addEventListener('input',()=>{updatePreview();setFilled(baseInput)});
fromInput.addEventListener('input',()=>setFilled(fromInput));
bodyInput.addEventListener('input',()=>setFilled(bodyInput));
send.addEventListener('click',async()=>{
  const base=baseInput.value.trim();
  const from=fromInput.value.trim();
  const body=bodyInput.value.trim();
  if(!base){out.className='result';out.textContent='Set backend base URL.';return}
  if(!from||!body){out.className='result';out.textContent='Enter From and Body.';return}
  try{
    send.disabled=true;send.textContent='Sending…';
    const form=new FormData();
    const normalizedFrom=/^whatsapp:/.test(from)?from:'whatsapp:'+from.replace(/^\+?/,'+');
    form.append('From',normalizedFrom);
    form.append('Body',body);
    const res=await fetch(base.replace(/\/$/,'')+'/whatsapp-endpoint',{method:'POST',body:form});
    const text=await res.text();
    out.className=res.ok?'result success':'result';
    out.textContent='Status '+res.status+'\n'+text;
  }catch(e){
    out.className='result';
    out.textContent=String(e);
  }finally{
    send.disabled=false;send.textContent='Send';
  }
});
updatePreview();

