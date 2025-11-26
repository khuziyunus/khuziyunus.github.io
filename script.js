const ENDPOINT='https://74cf7126dd9a.ngrok-free.app/whatsapp-endpoint';
const messages=document.getElementById('messages');
const phone=document.getElementById('phone');
const text=document.getElementById('text');
const send=document.getElementById('send');
const statusBox=document.getElementById('status');
function addMsg(cls,content){
  const wrap=document.createElement('div');
  wrap.className='msg '+cls;
  const b=document.createElement('div');
  b.className='bubble';
  b.textContent=content;
  wrap.appendChild(b);
  messages.appendChild(wrap);
  messages.scrollTop=messages.scrollHeight;
}
document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{
  text.value=c.dataset.lang;
}));
send.addEventListener('click',async()=>{
  const p=phone.value.trim();
  const t=text.value.trim();
  if(!p||!t){statusBox.textContent='Enter your WhatsApp number and a message.';return}
  addMsg('user',t);
  try{
    send.disabled=true;
    statusBox.textContent='Sending…';
    const form=new FormData();
    const normalized=/^\+/.test(p)?p:'+'+p;
    form.append('From','whatsapp:'+normalized);
    form.append('Body',t);
    const res=await fetch(ENDPOINT,{method:'POST',body:form});
    const body=await res.text();
    statusBox.textContent=res.ok?'Sent via WhatsApp':'Failed: '+res.status;
    if(body) addMsg('bot',body);
  }catch(e){
    statusBox.textContent=String(e);
  }finally{
    send.disabled=false;
    text.value='';
  }
});
