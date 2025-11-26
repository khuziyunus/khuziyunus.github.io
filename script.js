const ENDPOINT='https://74cf7126dd9a.ngrok-free.app/web-message';
const messages=document.getElementById('messages');
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
  const t=text.value.trim();
  if(!t){statusBox.textContent='Enter a message.';return}
  addMsg('user',t);
  try{
    send.disabled=true;
    statusBox.textContent='Processing…';
    const payload={ message:t };
    const res=await fetch(ENDPOINT,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    const data=await res.json();
    statusBox.textContent=res.ok?'Answered':'Failed: '+res.status;
    if(data&&data.answer){
      addMsg('bot',data.answer);
      if(data.source_language){
        statusBox.textContent+=` (language: ${data.source_language})`;
      }
    } else if(data&&data.error){
      statusBox.textContent='Error: '+data.error;
    }
  }catch(e){
    statusBox.textContent=String(e);
  }finally{
    send.disabled=false;
    text.value='';
  }
});
