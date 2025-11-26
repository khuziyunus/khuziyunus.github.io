const ENDPOINT='https://74cf7126dd9a.ngrok-free.app/web-message';
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
    const normalized=/^\+/.test(p)?p:'+'+p;
    const res=await fetch(ENDPOINT,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({to:'whatsapp:'+normalized,message:t})
    });
    const data=await res.json();
    statusBox.textContent=res.ok?'Sent via API':'Failed: '+res.status;
    if(data&&data.answer) addMsg('bot',data.answer);
  }catch(e){
    statusBox.textContent=String(e);
  }finally{
    send.disabled=false;
    text.value='';
  }
});
